import React, {Component} from 'react';
import { Row, Col } from 'react-bootstrap';
import ReactMarkdown from 'react-markdown'

import Overview from './overview.component';

let regexSubSubtitle = new RegExp(/^\w+:/);

export default class Tech extends Component {

	render () {
		let nav = (
			<Row style={{ margin: '0px 20px 20px 20px'}}>
				<Col className="nav-button left" onClick={() => this.props.openTech(this.props.previousTech)}>&lt;= {this.props.previousTech}</Col>
				<Col className="nav-button right" onClick={() => this.props.openTech(this.props.nextTech)}>{this.props.nextTech} =&gt;</Col>
			</Row>
		);

		let tech = this.props.tech;
		if (!tech) {
			return <h1>Tech is not available!</h1>
		}
		if (tech.name === "Overview") {
			return <>
				{nav}
				<Overview techNames={this.props.techNames} openTech={this.props.openTech}></Overview>
				{nav}
			</>
		}

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
					{nav}
					<hr/>
					<ReactMarkdown children={markdown}/>
					<hr/>
					{nav}
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