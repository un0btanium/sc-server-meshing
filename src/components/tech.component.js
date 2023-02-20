import React, {Component} from 'react';

import ReactMarkdown from 'react-markdown'

let regexSubSubtitle = new RegExp(/^\w+:/);

export default class Tech extends Component {

	render () {
		let tech = this.props.tech;
		let markdown = "";

		markdown = markdown + "# " + tech.name + "\n";
		markdown = markdown + this.getMarkdownWithSlideInfo(tech, this.props.slide);
		if (!this.props.slide && markdown === ("# " + tech.name + "\n")) {
			markdown = markdown + "Slide '" + this.props.slide.subtitle + "' not available!\n";
			this.getMarkdownWithSlideInfo(markdown, tech, undefined);
		}

		markdown = markdown + "### Sources\n";
		if (!tech.sources) {
			markdown = markdown + "No sources available!";
		} else {
			tech.sources.forEach((sourceIdentifier => {
				let source = this.props.sources[sourceIdentifier];
				if (!source) {
					console.error("Unknown source: " + sourceIdentifier);
					return;
				}
	
				markdown = markdown + /*sourceIdentifier + " - [" */ "[" + source.description + "](" + source.url + ")  \n";
			}));
		}

		return(
			<>
				<div>
					<ReactMarkdown children={markdown}/>
				</div>
			</>
		);
	}

	getMarkdownWithSlideInfo(tech, specificSlide) {
		let markdown = "";

		tech.slides.forEach(slide => {

			if (specificSlide && specificSlide.subtitle !== slide.subtitle) {
				return;
			}

			markdown = markdown + "### " + slide.subtitle + "\n";
	
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
		});

		return markdown;
	}
}