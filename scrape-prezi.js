const puppeteer = require('puppeteer');
const fs = require('fs');

const URL = 'https://prezi.com/p/xk5ilzstjrhy/star-citizen-unofficial-road-to-dynamic-server-meshing/';

const regexPageIndicator = new RegExp("^([0-9]*)\/([0-9]*)$");
const regexSources = new RegExp("^[\[](([a-zA-Z0-9]+,?)+)[\]]$");

const SLIDE_INDEX = '.Frame__IndexBadge-sc-1m37unb-3';
const SLIDE_FRAME = '.Frame__FrameWrapper-sc-1m37unb-4';
const TEXT_CLASS = '.TranscriptText__StyledHeader2-sc-1jllhx4-2';

const UUID_ATTRIBUTE = 'data-tracking-id';

const SLIDE_AMOUNT = 232;
const CHUNK_SIZE = 20;

async function getVisual() {
	console.time();

	console.log("Opening main page...");
	const mainBrowser = await puppeteer.launch();
	const mainPage = await mainBrowser.newPage();
	try {
		await mainPage.goto(URL, {
			waitUntil: 'load',
			timeout: 0
		});
		
		console.log("Scrolling to load all slide frames...");
		await autoScroll(mainPage, (str) => console.log(str));

		console.log("Extract slide info...");
		let slides = await mainPage.evaluate((SLIDE_FRAME, SLIDE_INDEX, UUID_ATTRIBUTE) => {
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

		console.log("Creating slide chunks...");
		let chunkedSlides = [];
		for (let i = 0; i < slides.length; i += CHUNK_SIZE) {
			const chunk = slides.slice(i, Math.min(i + CHUNK_SIZE, slides.length));
			chunkedSlides.push(chunk);
		}

		await Promise.all(chunkedSlides.map(async (slideChunk) => {
			try {
				const browser = await puppeteer.launch();
				console.log("Running chunk with size: ", slideChunk.length);
				for (let slide of slideChunk) {
					console.log("Opening page for slide:", slide.index, slide.uuid);
					const page = await browser.newPage();
					try {
						await page.goto(URL + '?frame=' + slide.uuid, {
							waitUntil: 'load',
							timeout: 0
						});
				
						await page.waitForSelector(TEXT_CLASS);
						const textElements = await page.$$(TEXT_CLASS);

						let texts = [];
						for (let textElement of textElements) {
							let text = await page.evaluate(textElement => textElement.innerText, textElement);
							texts.push(text);
						}
						if (texts[0] === "Unofficial Road to Dynamic Server Meshing") {
							console.log("Ignore slide because its overview: " + slide.index);
							return;
						}
						
						let pageIndicators = undefined;
						let index = -1;
						texts.forEach((text, i) => {
							let result = regexPageIndicator.exec(text);
							if (result !== null) {
								index = i;
								pageIndicators = {
									current: result[1],
									total: result[2]
								}
							}
						});
						if (index !== -1) {
							texts.slice(index, 1);
						}
						index = -1;
						let sources = undefined;
						texts.forEach((text, i) => {
							let result = regexSources.exec(text);
							if (result !== null) {
								index = i;
								sources = result[1].split(",");
							}
						});
						if (index !== -1) {
							texts.slice(index, 1);
						}
						let title = texts[0].length <= 85 ? texts[0] : undefined;
						let subtitle = texts[1].length <= 100 ? texts[1] : undefined;
						if (title.length !== 0 && subtitle.length !== 0) {
							texts.slice(0, 2);
						} else if (title.length !== 0) {
							texts.slice(0, 1);
						} else if (subtitle.length !== 0) {
							texts.slice(1, 1);
						}
						
						slide.pageIndicators = pageIndicators;
						slide.title = title;
						slide.subtitle = subtitle;
						slide.texts = texts;
						slide.sources = sources;
				
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
		console.log(title, subtitle)

		slides.sort((a, b) => a.index <= b.index ? -1 : 1);
		fs.writeFile("slides.json", JSON.stringify(slides, null, 4), 'utf8', function (err) {
			if (err) {
				console.log("An error occured while writing JSON Object to File.");
				return console.log(err);
			}
			console.log("Slides have been saved.");
		});

	} catch(e) {
		console.error(e)
	} finally {
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

function sleep(milliseconds) {
	return new Promise(resolve => setTimeout(resolve, milliseconds));
}

async function autoScroll(page) {
	let isLoaded = false;
	while (!isLoaded) {
		let viewport = await page.viewport()
		viewport.height = await page.evaluate(async () => document.body.scrollHeight);
		await page.setViewport(viewport);
		await page.evaluate(async () => window.scrollBy(0, 1500));
		let loadedSlidesAmount = await page.evaluate(async (SLIDE_FRAME) => document.body.querySelectorAll(SLIDE_FRAME).length, SLIDE_FRAME);
		isLoaded = loadedSlidesAmount === SLIDE_AMOUNT;
	}
}

getVisual();
