import React, { Component } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { BrowserRouter, Routes, Route } from 'react-router-dom';


import "bootstrap/dist/css/bootstrap.min.css";
import "./theme/bootstrap.css";
import './App.css';

import Tech from './components/tech.component';

import slides from './data/slides.json';
import sources from './data/sources.json';

class App extends Component {

	constructor(props) {
		super(props);

		this.openTech = this.openTech.bind(this);

		const searchParams = new URLSearchParams(window.location.search)
		let techName = searchParams.get('techName')  ? searchParams.get('techName') : undefined;
		let slideName = searchParams.get('slideName') ? searchParams.get('slideName') : undefined;

		let techs = [];
		let techOrder= [];
		let techsByName = {};
		let tech = {
			name: "893xr47g8"
		};
		for (let slide of slides) {
			if (slide.title === undefined) {
				continue;
			}

			if (slide.title !== tech.name) {
				tech = {
					name: slide.title,
					slides: [],
					sources: slide.sources
				};
				techs.push(tech);
				techsByName[slide.title] = tech;
				techOrder.push(slide.title);
			}

			tech.slides.push(slide);
		}
		console.log(techsByName);

		let techIndex = 0;
		let currentSlide = undefined;
		let currentTech = techOrder[techIndex];
		if (techsByName[techName]) {
			currentTech = techsByName[techName].name;
			let slides = techsByName[techName].slides.filter(s => s.subtitle === slideName);
			if (slides.length > 0) {
				currentSlide = slides[0];
			}
		}
		techIndex = techOrder.indexOf(techName);
		let previousTech = techOrder[techIndex === 0 ? techOrder.length-1 : techIndex-1];
		let nextTech = techOrder[techIndex === techOrder.length ? 0 : techIndex+1];

		this.state = {
			slides: slides,

			techs: techs,
			techOrder: techOrder,
			techsByName: techsByName,

			previousTech: previousTech,
			currentTech: currentTech,
			nextTech: nextTech,

			currentSlide: currentSlide
		};
	}

	getInitialSettings() {
		let defaultSettings = {};
		let loadedSettings = JSON.parse(localStorage.getItem('settings') || "{}");
		return { ...defaultSettings, ...loadedSettings};
	}

	openTech(techName) {
		let techOrder = this.state.techOrder;
		let techIndex = techOrder.indexOf(techName);
		let previousTech = techOrder[techIndex === 0 ? techOrder.length-1 : techIndex-1];
		let currentTech = techOrder[techIndex];
		let nextTech = techOrder[techIndex === techOrder.length-1 ? 0 : techIndex+1];

		console.log(techIndex, previousTech, currentTech, nextTech);

		this.setState({
			techIndex,
			previousTech,
			currentTech,
			nextTech
		})
	}

	render() {

		let nav = (
			<Row style={{ margin: '0px 20px 20px 20px'}}>
				<Col className="nav-button left" onClick={() => this.openTech(this.state.previousTech)}>&lt;= {this.state.previousTech}</Col>
				<Col className="nav-button right" onClick={() => this.openTech(this.state.nextTech)}>{this.state.nextTech} =&gt;</Col>
			</Row>
		);

		return (
			<Container style={{ marginTop: '25px', marginBottom: '50px' }}>
				{nav}
				<hr></hr>
				<BrowserRouter>
					<Routes>
						<Route
							path="/sc-server-meshing/"
							element={
								<Tech
									tech={this.state.techsByName[this.state.currentTech]}
									slide={this.state.currentSlide}
									sources={sources}
								/>
							}
						/>
					</Routes>
				</BrowserRouter>
				<hr></hr>
				{nav}
			</Container>
		);
	}
}

export default App;
