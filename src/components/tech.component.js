import React, {Component} from 'react';

import ReactMarkdown from 'react-markdown'

let regexSubSubtitle = new RegExp(/^\w+:/);

export default class Tech extends Component {

	render () {
		let tech = this.props.tech;
		let markdown = "";

		markdown = markdown + "# " + tech.name + "\n";

		tech.slides.forEach(slide => {

			if (this.props.slide && this.props.slide.subtitle !== slide.subtitle) {
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

		markdown = markdown + "### Sources\n";
		tech.sources.forEach((sourceIdentifier => {
			let source = this.props.sources[sourceIdentifier];
			if (!source) {
				console.error("Unknown source: " + source);
				return;
			}

			markdown = markdown + /*sourceIdentifier + " - [" */ "[" + source.description + "](" + source.url + ")  \n";
		}));


		return(
			<>
				<ReactMarkdown children={markdown} style={{fontFamily: "WorkSans"}}/>
			</>
		);
	}
}