import React, { Component } from 'react';
import { Container } from 'react-bootstrap';
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

		const searchParams = new URLSearchParams(window.location.search)
		let techName = searchParams.get('techName');
		let slideName = searchParams.get('slideName');

		console.log(techName, slideName)

		let techs = [];
		let techOrder= [];
		let techsByName = {};
		let tech = {
			name: "893xr47g8"
		};
		for (let slide of slides) {
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

		let currentTech = techOrder[0];
		let currentSlide = undefined;
		if (techsByName[techName]) {
			currentTech = techsByName[techName].name;
			let slides = techsByName[techName].slides.filter(s => s.subtitle === slideName);
			if (slides.length > 0) {
				currentSlide = slides[0];
			}
		}


		this.state = {
			slides: slides,
			techs: techs,
			techsByName: techsByName,
			currentTech: currentTech,
			currentSlide: currentSlide
		};
	}

	getInitialSettings() {
		let defaultSettings = {};
		let loadedSettings = JSON.parse(localStorage.getItem('settings') || "{}");
		return { ...defaultSettings, ...loadedSettings};
	}

	render() {
		return (
			<Container style={{ marginTop: '25px', marginBottom: '50px' }}>
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
			</Container>
		);
	}
}

export default App;
