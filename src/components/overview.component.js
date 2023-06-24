import React from 'react';
import { Link } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCopy } from '@fortawesome/free-solid-svg-icons'
import { CopyToClipboard } from 'react-copy-to-clipboard';

export default function Overview(props) {
	let index = 0;
	let links = props.techNames.map(techName => {
		if (index === 0) {
			index++;
			return undefined;
		}

		return (
			<div key={'index-' + index}>
				<CopyToClipboard className="pointer" text={props.websiteUrl + "?tech=" + encodeURIComponent(techName)}>
					<FontAwesomeIcon icon={faCopy} />
				</CopyToClipboard>
				<Link to={"/wiki/?tech=" + encodeURIComponent(techName)} className="disable-link-style">
					<span className="pointer" key={"tech-"+index}><span className="topic-number"> {(index < 10 ? '0' + index++ : index++)} </span>{techName}</span>
				</Link>
			</div>
		);
	});

	let sources = Object.values(props.sources).map(((source,i) => {
		let sourceText = <><b>{source.category + ":"}</b> {source.description}</>;
		if (source.url) {
			return <div key={"source-" + i}><a href={source.url}>{sourceText}</a></div>;
		} else {
			return <div key={"source-" + i}>{sourceText}</div>;
		}
	}));

	window.scrollTo(0, 0);

	return (
		<>
			<div>
				<hr></hr>
				<h1>Unofficial Road to Dynamic Server Meshing</h1>
				<h4>{props.stats.subtitle}</h4>
				<h5>Made By: {props.stats.authors}</h5>
				<h5>Last Updated:  {props.stats.lastUpdated}</h5>
				<h5>Current Live Patch:  {props.stats.livePatch}</h5>
				<hr></hr>
				<h3>Overview</h3>
				<img src={props.overviewImageURL} alt="Overview" style={{ display: 'block', margin: '20px auto 20px auto'}} />
				<hr></hr>
				<h3>Tech Topics</h3>
				{links}
				<hr></hr>
				<h3>Sources</h3>
				{sources}
				<hr></hr>
				<p>The information presented in this presentation is not officially endorsed by Cloud Imperium and doesn't reflect the views and opinions of Cloud Imperium or anyone officially involved in producing or managing Star Citizen and Squadron 42.</p>
				<hr></hr>
			</div>
		</>
	);
}