import React, {Component} from 'react';
import { Container, Row, Col } from 'react-bootstrap';

import ReactMarkdown from 'react-markdown'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHouse, faCopy } from '@fortawesome/free-solid-svg-icons'
import { CopyToClipboard } from 'react-copy-to-clipboard';

import Overview from './overview.component';

let regexSubSubtitle = new RegExp(/^[\w()/ ]{1,31}:/);

export default class Tech extends Component {

	render () {
		let nav = (
			<Row style={{ margin: '0px 20px 20px 20px'}}>
				<Col className="nav-button left" onClick={() => this.props.openTech(this.props.previousTech)}>&lt;= {this.props.previousTech}</Col>
				<Col className="nav-button middle d-flex align-items-center justify-content-center" onClick={() => this.props.openTech("Overview")}><FontAwesomeIcon icon={faHouse} /></Col>
				<Col className="nav-button right" onClick={() => this.props.openTech(this.props.nextTech)}>{this.props.nextTech} =&gt;</Col>
			</Row>
		);

		let tech = this.props.tech;
		if (!tech) {
			return <h1>Tech is not available!</h1>
		}
		if (tech.name === "Overview") {
			return <Container style={{ marginTop: '25px', marginBottom: '50px' }}>
				{nav}
				<Overview
					techNames={this.props.techNames}
					openTech={this.props.openTech}
					tech={this.props.tech}
					sources={this.props.sources}
					stats={this.props.stats}
					websiteUrl={this.props.websiteUrl}
				></Overview>
				{nav}
			</Container>
		}

		let markdown = "";

		markdown = markdown + "# " + tech.name + "\n";
		let slideInfo = this.getMarkdownWithSlideInfo(tech, this.props.slide);
		if (!this.props.slide && slideInfo === "") {
			markdown = markdown + "Slide '" + this.props.slide.subtitle + "' not available!\n";
			markdown = markdown + this.getMarkdownWithSlideInfo(markdown, tech, undefined);
		} else {
			markdown += slideInfo;
		}

		markdown = markdown + "### Sources\n";
		if (!tech.sources) {
			markdown = markdown + "No sources available!";
		} else {
			tech.sources
			.map((sourceIdentifier) => {
				let source = this.props.sources[sourceIdentifier];
				if (!source) {
					console.error("Unknown source: " + sourceIdentifier);
					return undefined;
				}

				let sourceText = "__" + source.category + "__: " + source.description;
				return {
					sourceIdentifier: sourceIdentifier,
					sourceText: sourceText,
					url: source.url
				};
			})
			.filter(source => source)
			.sort((a,b) => a.sourceText.localeCompare(b.sourceText))
			.forEach((source) => {
				if (source.url) {
					markdown = markdown + "[" + source.sourceText + "](" + source.url + ")  \n";
				} else {
					markdown = markdown + source.sourceText + "  \n";
				}
			});
		}

		return(
			<Container style={{ marginTop: '25px', marginBottom: '50px' }}>
				<div>
					{nav}
					<hr/>
					<ReactMarkdown children={markdown}/>
					<hr/>
					<CopyToClipboard className="pointer" text={this.props.websiteUrl + "?tech=" + encodeURIComponent(tech.name)}>
						<span><FontAwesomeIcon icon={faCopy} /> Copy & share link to this tech!</span>
					</CopyToClipboard>
					<hr/>
					{nav}
				</div>
			</Container>
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