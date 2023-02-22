import React, {Component} from 'react';

export default class Overview extends Component {

	render () {
		
		let index = 0;
		let links = this.props.techNames.map(techName => {
			if (index === 0) {
				index++;
				return undefined;
			}

			return <div className="pointer" key={"tech-"+index} onClick={() => this.props.openTech(techName)}>{index++ + " " +techName}</div>;
		});

		return (
			<>
				<div>
					<h1>Unofficial Road to Dynamic Server Meshing</h1>
					<h4>2014-2022 Star Citizen WIP Engine & Server Backend Technology Overview</h4>
					<h5>Made By: unobtanium & SC community</h5>
					<h5>Last Updated: 12. November 2022 (Current Live Patch: Alpha 3.17.3)</h5>
					<hr></hr>
					<h3>Overview</h3>
					<img src={this.props.tech.originalSlideImageURL} alt="Overview" />
					{links}
					<hr></hr>
					<p>The information presented in this presentation is not officially endorsed by Cloud Imperium and doesn't reflect the views and opinions of Cloud Imperium or anyone officially involved in producing or managing Star Citizen and Squadron 42.</p>
				</div>
			</>
		);
	}

}