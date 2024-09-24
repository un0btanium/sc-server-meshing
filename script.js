const fs = require('fs');
const path = require('path');
const axios = require('axios');

const folderPublicTechs = './public/techs/';

const oldSlides = require('./src/data/slides.json');

const regexSubSubtitle = new RegExp(/^[\w()/ ]{1,31}:/);

const DOWNLOAD_IMAGES = false;

if (!fs.existsSync(folderPublicTechs)){
    fs.mkdirSync(folderPublicTechs);
}



(async () => {
	let imageFileNameTechIndexes = {};
	for (let oldSlide of oldSlides) {
		let imageURLs = oldSlide.imageURLs ?? [];

		if (imageURLs.length == 0) {
			continue;
		}

		let pathName = '/images/' + getSimplifiedTitle(oldSlide.title);
		let folderName = './public' + pathName;
		if (!fs.existsSync(folderName)){
			fs.mkdirSync(folderName);
		}

		let index = imageFileNameTechIndexes[pathName] ? Number(imageFileNameTechIndexes[pathName]) : 0;
		let updatedImageURLs = [];
		for (let imageURL of imageURLs) {
			let number = ((index+1) < 10 ? '0'+(index+1) : index+1)
			let fileName = 'image-' + number + '.png';
			let pathAndFileName = pathName + '/' + fileName;
			if (DOWNLOAD_IMAGES) {
				await downloadImage(imageURL, pathAndFileName);
			}
			updatedImageURLs.push(pathAndFileName);
			index++;
		}
		imageFileNameTechIndexes[pathName] = imageFileNameTechIndexes[pathName] ? imageFileNameTechIndexes[pathName] + imageURLs.length : imageURLs.length;

		oldSlide.imageURLs = updatedImageURLs;
	}


	let previousTechName = "";
	let techs = [];
	let techAllMarkup = {};
	let allMarkup = '';
	for (let oldSlide of oldSlides) {
		let tech;
		let slideMarkup = '';
		if (previousTechName != oldSlide.title) {
			tech = {
				title: oldSlide.title,
				markupFileName: getSimplifiedTitle(oldSlide.title),
				slideAmount: 0,
				// imageURLs: [],
				sources: new Set()
			}
			techs.push(tech);
			techAllMarkup[tech.markupFileName] = '';
			if (oldSlide.title !== "Sources") {
				slideMarkup = slideMarkup + "# " + oldSlide.title + "\n";
			}
		} else {
			tech = techs[techs.length - 1]
		}

		// tech.imageURLs.push(oldSlide.imageURLs ?? []);
		(oldSlide.sources ?? []).forEach(source => tech.sources.add(source));
		tech.slideAmount += 1;

		slideMarkup += getSlideMarkdown(oldSlide);
		fs.writeFileSync(folderPublicTechs + tech.markupFileName + '-' + tech.slideAmount + '.md' , slideMarkup);
		techAllMarkup[tech.markupFileName] += slideMarkup;
		allMarkup += slideMarkup;

		previousTechName = oldSlide.title;
	}

	techs.forEach(tech => tech.sources = Array.from(tech.sources));

	Object.keys(techAllMarkup).forEach(key => {
		if (techs.filter(tech => tech.markupFileName == key)[0].slideAmount === 1) {
			return;
		}
		fs.writeFileSync(folderPublicTechs + key + '.md', techAllMarkup[key])
	});

	fs.writeFileSync('./src/data/techs.json', JSON.stringify(techs, null, 4));
	fs.writeFileSync(folderPublicTechs + '/unofficial-road-to-dynamic-server-meshing.md', allMarkup);
})();



function getSimplifiedTitle(title) {
	return title.toLowerCase().replaceAll('(', '').replaceAll(')', '').replaceAll('-', '').replaceAll(',', ' &').replaceAll('/', '_').replaceAll(/\s+/g, '_');
}

function getSlideMarkdown(slide) {
	let markdown = "";

	if (slide.subtitle) {
		markdown = markdown + "### " + slide.subtitle + "\n";
	}

	let isBulletpoint = false;
	slide.texts.forEach(text => {
		let isBulletpointTemp = text.startsWith("* ")
		let isSubSubtitle = regexSubSubtitle.exec(text);
		if (isSubSubtitle) {
			text = text.replace(isSubSubtitle[0], "__" + isSubSubtitle[0] + "__");
		}
		markdown = markdown + (isBulletpoint && !isBulletpointTemp ? "\n" : "") + text + "\n" + (isBulletpointTemp ? "" : "\n");
		isBulletpoint = isBulletpointTemp;
	});

	(slide.imageURLs || []).forEach((imageURL => {
		markdown = markdown + (isBulletpoint ? "\n" : "") + "![Image](" + imageURL + ")\n";
		isBulletpoint = false;
	}));

	return markdown;
};

async function downloadImage(url, filePath) {
    try {
        const response = await axios({
            url,
            method: 'GET',
            responseType: 'stream',
        });

        response.data.pipe(fs.createWriteStream(filePath));

        return new Promise((resolve, reject) => {
            response.data.on('end', () => {
                console.log(`Downloaded: ${filePath}`);
                resolve();
            });

            response.data.on('error', err => {
                console.error(`Error downloading ${url} => ${filePath}`);
                reject(err);
            });
        });
    } catch (error) {
        console.error(`Error downloading ${url}`, error);
    }
};