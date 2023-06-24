import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link, useSearchParams } from 'react-router-dom';

import ReactMarkdown from 'react-markdown'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHouse, faCopy } from '@fortawesome/free-solid-svg-icons'
import { CopyToClipboard } from 'react-copy-to-clipboard';

import Overview from './overview.component';

let regexSubSubtitle = new RegExp(/^[\w()/ ]{1,31}:/);

export default function Tech(props) {
	let [searchParams] = useSearchParams();

	const determineTechsAndSlide = () => {
		let tech = searchParams.get('tech') ? decodeURIComponent(searchParams.get('tech')) : undefined;
		let slide = searchParams.get('slide') ? decodeURIComponent(searchParams.get('slide')) : undefined;

		let techNameLowerCase = (tech || props.techOrder[0]).toLowerCase();
		let currentTech = props.techOrder[0];
		let currentSlide = undefined;
		if (props.techsByName[techNameLowerCase]) {
			currentTech = props.techsByName[techNameLowerCase].name;
			let specificSlides = props.techsByName[techNameLowerCase].slides.filter(s => s.subtitle === slide);
			if (specificSlides.length > 0) {
				currentSlide = specificSlides[0];
			}
		} else {
			techNameLowerCase = props.techOrderLowerCase[0];
		}

		let techIndex = props.techOrderLowerCase.indexOf(techNameLowerCase);
		let previousTech = props.techOrder[techIndex === 0 ? props.techOrder.length-1 : techIndex-1];
		let nextTech = props.techOrder[techIndex === props.techOrder.length-1 ? 0 : techIndex+1];

		return { previousTech, currentTech, nextTech, currentSlide } ;
	}

	const getMarkdownWithSlideInfo = (tech, specificSlide) => {
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
	};

	let { previousTech, currentTech, nextTech } = determineTechsAndSlide();
	let tech = props.techsByName[currentTech.toLowerCase()];

	let nav = (
		<Row style={{ margin: '0px 20px 20px 20px'}}>
			<Col as={Link} to={"/wiki/?tech=" + encodeURIComponent(previousTech)} className="nav-button left disable-link-style">&lt;= {previousTech}</Col>
			<Col as={Link} to={"/wiki"} className="nav-button middle d-flex align-items-center justify-content-center disable-link-style"><FontAwesomeIcon icon={faHouse} /></Col>
			<Col as={Link} to={"/wiki/?tech=" + encodeURIComponent(nextTech)} className="nav-button right disable-link-style">{nextTech} =&gt;</Col>
		</Row>
	);

	if (!tech) {
		return <h1>Tech is not available!</h1>
	}
	if (tech.name === "Overview") {
		return <Container style={{ marginTop: '25px', marginBottom: '50px' }}>
			{nav}
			<Overview
				overviewImageURL={tech.originalSlideImageURL}
				techNames={props.techOrder}
				sources={props.sources}
				stats={props.stats}
				websiteUrl={props.websiteUrl}
			></Overview>
			{nav}
		</Container>
	}

	let markdown = "";

	markdown = markdown + "# " + tech.name + "\n___\n";
	let slideInfo = getMarkdownWithSlideInfo(tech, props.slide);
	if (!props.slide && slideInfo === "") {
		markdown = markdown + "Slide '" + props.slide.subtitle + "' not available!\n";
		markdown = markdown + getMarkdownWithSlideInfo(markdown, tech, undefined);
	} else {
		markdown += slideInfo;
	}

	markdown = markdown + "### Sources\n";
	if (!tech.sources) {
		markdown = markdown + "No sources available!";
	} else {
		tech.sources
		.map((sourceIdentifier) => {
			let source = props.sources[sourceIdentifier];
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

	
	window.scrollTo(0, 0);	

	return(
		<Container style={{ marginTop: '25px', marginBottom: '50px' }}>
			<div>
				{nav}
				<hr/>
				<ReactMarkdown children={markdown}/>
				<hr/>
				<CopyToClipboard className="pointer" text={props.websiteUrl + "?tech=" + encodeURIComponent(tech.name)}>
					<span><FontAwesomeIcon icon={faCopy} /> Copy & share link to this tech!</span>
				</CopyToClipboard>
				<hr/>
				{nav}
			</div>
		</Container>
	);
}