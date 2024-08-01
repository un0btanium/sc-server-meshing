const puppeteer = require('puppeteer');
const fs = require('fs');

// TODO dont forget to update the amount of slides after adding or removing slides in the presentation
const PRESENTATIONS = [
	{
		url: 'https://prezi.com/p/dxnzpqo4jouz/test/',
		slideAmount: 87
	}
];

// The "Fuck Prezi" Rework
// 1) turn each topic into a markup file, save file to disk
// 2) add topic with its sources (individual links and description text) to an overall json file (list of topics)
// 3) use this data to create the mobile views
// 4) recreate the overview landing page in html and css (DONE)
// 5) add links from this new landing page to the mobile view topics (trigger function by name, lookup in overall json file list) (DONE)
// 6) delete Prezi (but not really) (DONE)

const regexPageIndicator = new RegExp("^([0-9]*)\/([0-9]*)$");
const regexSources = new RegExp(/^\[(([a-zA-Z0-9\-]+[,]?[\n]?)+)\]$/);
const regexStats = new RegExp(/^Made By: (?<authors>[\w& ]+) Last Updated: (?<lastUpdated>[\w. ]+) \(Current Live Patch: (?<livePatch>[\w. ]+)\)$/);

const SLIDE_INDEX = '.Frame__IndexBadge-sc-1m37unb-3';
const SLIDE_FRAME = '.Frame__FrameWrapper-sc-1m37unb-4';
const TEXT_CLASS = '.TranscriptTopic__StyledTextDiv-p179ej-0 > div > h2,.TranscriptTopic__StyledTextDiv-p179ej-0 > div > .TranscriptText__StyledList-sc-1jllhx4-5 > li';
// const BULLETPOINTS_CLASS = '.TranscriptText__StyledList-sc-1jllhx4-5'
const ORIGINAL_SLIDE_CLASS = '.ExpandedFrameView__FrameImage-sw0ek0-5';
const IMAGE_CLASS = '.AssetView__ThumbnailImage-sc-1ptrnll-2';

const UUID_ATTRIBUTE = 'data-tracking-id';

const CHUNK_AMOUNT = 2;


process.setMaxListeners(50);

async function getVisual() {
	console.time();

	let allSlides = [];
	let index = 1;
	for (let presentation of PRESENTATIONS) {
		let chunkSize = Math.ceil(presentation.slideAmount / CHUNK_AMOUNT);

		console.log("Opening page " + presentation.url);

		const mainBrowser = await puppeteer.launch();
		const mainPage = await mainBrowser.newPage();
		try {
			await mainPage.goto(presentation.url, { waitUntil: 'load', timeout: 0 });
			
			await autoScroll(mainPage, presentation.slideAmount, (str) => console.log(str));
			let slides = await extractSlideInfos(mainPage);
			let chunkedSlides = createChunkedSlides(slides, chunkSize);


			await Promise.all(chunkedSlides.map(async (slideChunk) => {
				try {
					const browser = await puppeteer.launch();

					for (let slide of slideChunk) {
						console.log("Opening slide with id:", slide.index);

						const page = await browser.newPage();
						page.setViewport({ width: 1920, height: 1080 });

						try {
							await page.goto(presentation.url + '?frame=' + slide.uuid, { waitUntil: 'load', timeout: 0 });

							let originalSlideImageURL = await extractOriginalSlideImage(page);

							let texts = await extractTexts(page, slide);
							if (excludeSlide(texts, slide) && slide.index !== 1) {
								continue;
							}
							
							console.log("Extracting slide with id:", slide.index);
							
							if(slide.index === 1) {
								extractingStats(texts);
							}
							
							let pageIndicators = extractPageIndicators(texts);
							let sources = extractSources(texts);
							let [title,subtitle] = extractTitleAndSubtitle(texts); // do these after sources and slide indicators, sources might be at the top
							let imageURLs = await extractImages(page, slide);
	
							slide.pageIndicators = pageIndicators;
							slide.title = title;
							slide.subtitle = subtitle;
							slide.texts = texts;
							slide.sources = sources;
							slide.imageURLs = imageURLs;
							slide.originalSlideImageURL = originalSlideImageURL;
					
						} catch(e) {
							console.error(e);
						} finally {
							await page.close();
						}
					}

				} catch(e) {
					console.error(e);
				} finally {
					await mainBrowser.close();
				}
			}));


			slides.sort((a, b) => a.index <= b.index ? -1 : 1);
			for (let slide of slides) {
				slide.index = index++;
			}

			allSlides.push(...slides);

		} catch(e) {
			console.error(e)
		} finally {
			printStatistics(allSlides);
			saveSlides(allSlides);

			console.timeEnd();
			try {
				await mainPage.close();
			} catch(e1) {
				console.error(e1);
			}
			try {
				await mainBrowser.close();
			} catch(e2) {
				console.error(e2);
			}
			
		}
	}
}

async function autoScroll(page, slideAmount) {
	console.log("Scrolling to load all", slideAmount, "slide frames...");
	
	await page.screenshot({path: 'screenshot.png'});

	let isLoaded = false;
	while (!isLoaded) {
		let viewport = await page.viewport()
		viewport.height = await page.evaluate(async () => document.body.scrollHeight);
		await page.setViewport(viewport);
		await page.evaluate(async () => window.scrollBy(0, 1500));
		let loadedSlidesAmount = await page.evaluate(async (SLIDE_FRAME) => document.body.querySelectorAll(SLIDE_FRAME).length, SLIDE_FRAME);
		isLoaded = loadedSlidesAmount === slideAmount;
		console.log("Loaded", loadedSlidesAmount, "slides already...");
		await page.screenshot({path: 'screenshot.png'});
	}
}

async function extractSlideInfos(mainPage) {
	console.log("Extract meta slide info...");

	return await mainPage.evaluate((SLIDE_FRAME, SLIDE_INDEX, UUID_ATTRIBUTE) => {
		let slideFrames = Array.from(document.body.querySelectorAll(SLIDE_FRAME));
		return slideFrames.map((slideFrame) => {
			let uuid = slideFrame.getAttribute(UUID_ATTRIBUTE);
			let indexElement = slideFrame.querySelector(SLIDE_INDEX);
			let index = indexElement.innerText;
			return {
				uuid: uuid,
				index: parseInt(index)
			};
		});
	}, SLIDE_FRAME, SLIDE_INDEX, UUID_ATTRIBUTE);
}

function createChunkedSlides(slides, chunkSize) {
	console.log("Creating slide chunks...");

	let chunkedSlides = [];
	for (let i = 0; i < slides.length; i += chunkSize) {
		const chunk = slides.slice(i, Math.min(i + chunkSize, slides.length));
		chunkedSlides.push(chunk);
	}

	console.log("Chunk Sizes: [", chunkedSlides.map(chunk => chunk.length).join(', '), "]");

	return chunkedSlides;
}

function extractingStats(texts) {
	console.log("Extracting stats...");

	let stats = {};
	texts.forEach((text) => {
		let result = regexStats.exec(text);
		if (result !== null) {
			stats = {
				authors: result.groups.authors,
				lastUpdated: result.groups.lastUpdated,
				livePatch: result.groups.livePatch
			};
		}
	});

	if (stats !== {}) {
		stats.subtitle = texts[5];
		saveStats(stats);
	}
}


function extractTitleAndSubtitle(texts) {
	let title = texts[0].length <= 85 ? texts[0] : "";
	let subtitle = texts[1].length <= 100 ? texts[1] : "";

	if (title.length !== 0 && subtitle.length !== 0) {
		texts.splice(0, 2);
	} else if (title.length !== 0) {
		texts.splice(0, 1);
	} else if (subtitle.length !== 0) {
		texts.splice(1, 1);
	}

	return [title,subtitle];
}

async function extractOriginalSlideImage(page) {
	await page.waitForSelector(ORIGINAL_SLIDE_CLASS, { timeout: 0 });
	sleep(5000);
	return await page.evaluate((ORIGINAL_SLIDE_CLASS) => document.body.querySelector(ORIGINAL_SLIDE_CLASS).getAttribute("src"), ORIGINAL_SLIDE_CLASS);
}

async function extractTexts(page, slide) {
	try {
		await page.waitForSelector(TEXT_CLASS, { timeout: 10000 });
	} catch (e) {
		console.log("TIMEOUT", e, slide.index, slide.uuid);
		await page.screenshot({path: 'screenshot-timeout.png'});
	}

	const textElements = await page.$$(TEXT_CLASS);
	console.log(textElements.length, slide.index, slide.uuid);
	let texts = [];
	for (let textElement of textElements) {
		let text = await page.evaluate(textElement => {
			if (textElement.localName === "li") {
				return "* " + textElement.innerText;
			}
			return textElement.innerText;
		}, textElement);
		texts.push(text);
	}
	
	return texts.filter(text => text); // remove empty strings
}

async function extractImages(page) {
	let imageURLs = undefined;
	try {
		await page.waitForSelector(IMAGE_CLASS /*'.ExpandedFrameView__FrameExtraInfoTitle-sw0ek0-6'*/, { timeout: 2000 });
		const imageElements = await page.$$(IMAGE_CLASS);
		imageURLs = [];
		for (let imageElement of imageElements) {
			let url = await page.evaluate(imageElement => imageElement.getAttribute("src"), imageElement);
			imageURLs.push(url);
		}
	} catch (e) {}
	return imageURLs;
}

function extractPageIndicators(texts) {
	let pageIndicators = undefined;
	let index = -1;

	texts.forEach((text, i) => {
		let result = regexPageIndicator.exec(text);
		if (result !== null) {
			index = i;
			pageIndicators = {
				current: result[1],
				total: result[2]
			};
		}
	});

	if (index !== -1) {
		texts.splice(index, 1);
	}

	return pageIndicators;
}

function extractSources(texts) {
	let index = -1;
	let sources = undefined;

	texts.forEach((text, i) => {
		let result = regexSources.exec(text);
		if (result !== null) {
			index = i;
			sources = result[1].replace("\n", "").split(",");

			let multipleSourcesIndex = sources.indexOf("s201-s209");
			if (multipleSourcesIndex !== -1) {
				sources.splice(multipleSourcesIndex, 1);
				sources.push("s201", "s202", "s203", "s204", "s205", "s206", "s207", "s208", "s209");
			}
			multipleSourcesIndex = sources.indexOf("w7-w9");
			if (multipleSourcesIndex !== -1) {
				sources.splice(multipleSourcesIndex, 1);
				sources.push("w7", "w8", "w9");
			}
		}
	});

	if (index !== -1) {
		texts.splice(index, 1);
	}

	return sources;
}

function sleep(milliseconds) {
	return new Promise(resolve => setTimeout(resolve, milliseconds));
}

function saveSlides(slides) {
	fs.writeFile("./src/data/slides2.json", JSON.stringify(slides, null, 4), 'utf8', function (err) {
		if (err) {
			console.log("An error occured while writing JSON Object to File.");
			return console.log(err);
		}
		console.log("Slides have been saved.");
	});
}


function saveStats(stats) {
	fs.writeFile("./src/data/stats.json", JSON.stringify(stats, null, 4), 'utf8', function (err) {
		if (err) {
			console.log("An error occured while writing JSON Object to File.");
			return console.log(err);
		}
		console.log("Stats have been saved.");
	});
}


function excludeSlide(texts, slide) {
	if (texts[0] === "Unofficial Road to Dynamic Server Meshing") {
		console.log("Ignore slide because its overview: ", slide.index);
		return true;
	}
	if (texts[0] === "Welcome to the") {
		console.log("Ignore slide because its introduction welcome: ", slide.index);
		return true;
	}
	if (texts[0] === "Sources") {
		console.log("Ignore slide because its sources: ", slide.index);
		return true;
	}
	
	return false;
}

function printStatistics(slides) {
	let title = {
		min: 999999,
		max: 0
	}
	let subtitle = {
		min: 999999,
		max: 0
	}
	slides.forEach(slide => {
		if (slide.title && slide.title.length < title.min) {
			title.min = slide.title.length;
		}
		if (slide.title && slide.title.length > title.max) {
			title.max = slide.title.length;
		}
		if (slide.subtitle && slide.subtitle.length < subtitle.min) {
			subtitle.min = slide.subtitle.length;
		}
		if (slide.subtitle && slide.subtitle.length > subtitle.max) {
			subtitle.max = slide.subtitle.length;
		}
	})
	console.log("title", title)
	console.log("subtitle", subtitle)
}

getVisual();
