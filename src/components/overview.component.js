import React, {Component} from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCopy } from '@fortawesome/free-solid-svg-icons'
import { CopyToClipboard } from 'react-copy-to-clipboard';

const URL = "https://un0btanium.github.io/sc-server-meshing/";

export default class Overview extends Component {

	render () {
		
		let index = 0;
		let links = this.props.techNames.map(techName => {
			if (index === 0) {
				index++;
				return undefined;
			}

			return (
				<div key={'index-' + index}>
					<CopyToClipboard className="pointer" text={URL + "?tech=" + encodeURIComponent(techName)}>
						<FontAwesomeIcon icon={faCopy} />
					</CopyToClipboard>
					<span className="pointer" key={"tech-"+index} onClick={() => this.props.openTech(techName)}><span className="topic-number"> {(index < 10 ? '0' + index++ : index++)} </span>{techName}</span>
				</div>
			);
		});

		let sources = Object.values(this.props.sources).map(((source,i) => {
			let sourceText = <><b>{source.category + ":"}</b> {source.description}</>;
			if (source.url) {
				return <div key={"source-" + i}><a href={source.url}>{sourceText}</a></div>;
			} else {
				return <div key={"source-" + i}>{sourceText}</div>;
			}
		}));

		return (
			<>
				<div>
					<h1>Unofficial Road to Dynamic Server Meshing</h1>
					<h4>2014-2022 Star Citizen WIP Engine & Server Backend Technology Overview</h4>
					<h5>Made By: unobtanium & SC community</h5>
					<h5>Last Updated: 12. November 2022 (Current Live Patch: Alpha 3.17.3)</h5>
					<hr></hr>
					<h3>Overview</h3>
					<img src={this.props.tech.originalSlideImageURL} alt="Overview" style={{ display: 'block', margin: '20px auto 20px auto'}} />
					<hr></hr>
					<h3>Tech Topics</h3>
					{links}
					<hr></hr>
					<h3>Sources</h3>
					{sources}
					<hr></hr>
					<p>The information presented in this presentation is not officially endorsed by Cloud Imperium and doesn't reflect the views and opinions of Cloud Imperium or anyone officially involved in producing or managing Star Citizen and Squadron 42.</p>
				</div>
			</>
		);
	}

}