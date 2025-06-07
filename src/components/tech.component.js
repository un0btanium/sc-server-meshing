import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link, useSearchParams } from 'react-router-dom';

import ReactMarkdown from 'react-markdown'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHouse, faCopy } from '@fortawesome/free-solid-svg-icons'
import { CopyToClipboard } from 'react-copy-to-clipboard';

import Overview from './overview.component';

export default function Tech(props) {
	let [searchParams] = useSearchParams();
	let paramTech = searchParams.get('tech') ? decodeURIComponent(searchParams.get('tech')) : undefined;
	const [currentSlideIndex, setCurrentSlideIndex] = useState(searchParams.has('neo') ? 0 : 1000);
	const [markup, setMarkup] = useState(new Set());

	let techNameLowerCase = (paramTech || props.techOrder[0]).toLowerCase();
	let currentTech = props.techOrder[0];
	if (props.techsByName[techNameLowerCase]) {
		currentTech = props.techsByName[techNameLowerCase].title;
	} else {
		techNameLowerCase = props.techOrderLowerCase[0];
	}

	let techIndex = props.techOrderLowerCase.indexOf(techNameLowerCase);
	let previousTech = props.techOrder[techIndex === 0 ? props.techOrder.length-1 : techIndex-1];
	let nextTech = props.techOrder[techIndex === props.techOrder.length-1 ? 0 : techIndex+1];

	let tech = props.techsByName[currentTech.toLowerCase()];
	let lastSlideIndex = tech.slideAmount-1;
	// console.log("render", currentSlideIndex, tech)

	let loadTechMarkup = () => {
		console.log("useEffect", currentSlideIndex, tech)
		let loadSingleSlide = false;
		let markupFileName = tech.markupFileName;
		
		if (tech.slideAmount === 1) {
			loadSingleSlide = true;
			markupFileName += "-1";
		} else if (currentSlideIndex < tech.slideAmount && !(currentSlideIndex === tech.slideAmount-1 && markup.size < tech.slideAmount-1)) {
			loadSingleSlide = true;
			markupFileName += "-" + (currentSlideIndex+1);
		}
		
		fetch("/techs/" + markupFileName + ".md")
			.then((response) => response.text())
			.then((text) => {
				if (loadSingleSlide) {
					let newMarkup = new Set(markup.values().toArray());
					newMarkup.add(text);
					setMarkup(newMarkup);
				} else {
					setMarkup(new Set([text]));
				}
			});
	}

	useEffect(loadTechMarkup, [currentSlideIndex]);
	useEffect(() => {
		setCurrentSlideIndex(searchParams.has('neo') ? 0 : currentSlideIndex === 1000 ? 2000 : 1000);
		setMarkup(new Set());
		if (tech.title == "Prologue & Summary" && currentSlideIndex === 0) {
			setCurrentSlideIndex(1);
		}
	}, [paramTech]);

	let nav;
	let showMoreButton;
	let showAllButton;
	if (searchParams.has('neo')) {
		let nextLink = "/?nextTech=" + encodeURIComponent(nextTech);
		if (currentTech === "Single Shard") {
			nextLink = "/wiki?tech=" + encodeURIComponent("Prologue & Summary") + "&neo";
		} else if (currentTech === "Prologue & Summary") {
			nextLink = "/wiki?tech=" + encodeURIComponent("Special Thanks") + "&neo";
		} else if (currentTech === "Sources") {
			nextLink = "/";
		}
		
		let doBlink = lastSlideIndex === currentSlideIndex ? " blink" : "";

		showMoreButton = currentSlideIndex < lastSlideIndex ? <Row style={{ margin: '0px 0px 20px 0px'}}>
			<Col className="nav-button disable-link-style large blink" onClick={() => setCurrentSlideIndex(currentSlideIndex + 1)}>Show more</Col>
		</Row> : tech.title !== "Sources" ? <Row style={{ margin: '0px 0px 20px 0px'}}>
			<Col as={Link} to={nextLink} className={"nav-button large disable-link-style blink"} >Back to Overview and next Tech =&gt;</Col>
		</Row> : undefined
		
		showAllButton = currentSlideIndex < lastSlideIndex ? <Row style={{ margin: '0px 0px 20px 0px'}}>
			<Col className="nav-button disable-link-style large" onClick={() => setCurrentSlideIndex(lastSlideIndex)}>Show all</Col>
		</Row> : undefined
		
		nav = (
			<Row style={{ margin: '0px 0px 20px 0px'}}>
				<Col as={Link} to={"/?nextTech=" + encodeURIComponent(currentTech)} className="nav-button left disable-link-style"> &lt;= Back</Col>
				<Col as={Link} to={"/"} className="nav-button middle d-flex align-items-center justify-content-center disable-link-style"><FontAwesomeIcon icon={faHouse} /></Col>
				<Col as={Link} to={nextLink} className={"nav-button right disable-link-style" + doBlink} >Next Tech =&gt; </Col>
			</Row>
		);
	} else {
		nav = (
			<Row style={{ margin: '0px 0px 20px 0px'}}>
				<Col as={Link} to={"/wiki/?tech=" + encodeURIComponent(previousTech)} className="nav-button left disable-link-style"> &lt;= {previousTech}</Col>
				<Col as={Link} to={"/wiki"} className="nav-button middle d-flex align-items-center justify-content-center disable-link-style"><FontAwesomeIcon icon={faHouse} /></Col>
				<Col as={Link} to={"/wiki/?tech=" + encodeURIComponent(nextTech)} className="nav-button right disable-link-style">{nextTech} =&gt; </Col>
			</Row>
		);
	}


	if (!tech) {
		return <h1>Tech is not available!</h1>
	}
	if (tech.title === "Overview") {
		return <Container style={{ marginTop: '25px', marginBottom: '50px' }}>
			{nav}
			<Overview
				techNames={props.techOrder}
				sources={props.sources}
				stats={props.stats}
				websiteUrl={props.websiteUrl}
			></Overview>
			{nav}
		</Container>
	}

	
	let markdown = markup.length === 0 ? "" : markup.values().toArray().join("\n");

	let markdownSources = "### Sources\n";
	let sources = tech.sources;
	if (tech.title === "Sources") {
		sources = Object.keys(props.sources);
	}

	if (!sources) {
		markdownSources = markdownSources + "No sources available!";
	} else {
		sources
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
					markdownSources += "[" + source.sourceText + "](" + source.url + ")  \n";
				} else {
					markdownSources += source.sourceText + "  \n";
				}
			});
	}

	if (!searchParams.has('neo')) {
		window.scrollTo(0, 0);
	}	

	return(
		<Container style={{ marginTop: '25px', marginBottom: '50px' }}>
			<div>
				{nav}
				<hr/>
				<ReactMarkdown children={markdown}/>
				{showMoreButton}
				<ReactMarkdown children={markdownSources}/>
				<hr/>
				<CopyToClipboard className="pointer" text={props.websiteUrl + "?tech=" + encodeURIComponent(tech.title)}>
					<span><FontAwesomeIcon icon={faCopy} /> Copy & share link to this tech!</span>
				</CopyToClipboard>
				<hr/>
				{showAllButton}
				{nav}
			</div>
		</Container>
	);
}