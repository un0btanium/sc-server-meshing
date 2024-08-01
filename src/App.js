import React, { Component } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom'; // TODO rework nagivation

import "bootstrap/dist/css/bootstrap.min.css";
import "./theme/bootstrap.css";
import './App.css';

import Tech from './components/tech.component';
import Presentation from './components/presentation.component';
import NeoOverview from './components/neo-overview.component';

import slides from './data/slides.json';
import sources from './data/sources.json';
import stats from './data/stats.json';

const URL = "https://sc-server-meshing.info/wiki/";

class App extends Component {

	constructor(props) {
		super(props);

		let techOrder= [];
		let techOrderLowerCase= [];
		let techsByName = {};
		let tech = {
			name: "Overview",
			slides: [],
			sources: [],
			originalSlideImageURL: slides[0].originalSlideImageURL
		};
		techOrder.push(tech.name);
		techOrderLowerCase.push(tech.name.toLowerCase());
		techsByName[tech.name.toLowerCase()] = tech;
		
		for (let slide of this.optimizeSlides(slides)) {

			if (this.skipSlide(slide)) {
				continue;
			}

			if (slide.title !== tech.name) {
				tech = {
					name: slide.title,
					slides: [],
					sources: slide.sources
				};
				techsByName[slide.title.toLowerCase()] = tech;
				techOrder.push(slide.title);
				techOrderLowerCase.push(slide.title.toLowerCase());
			}

			tech.slides.push(slide);
		}

		this.state = {
			techOrder: techOrder,
			techOrderLowerCase: techOrderLowerCase,
			techsByName: techsByName,
		};
	}

	// getInitialSettings() {
	// 	let defaultSettings = {};
	// 	let loadedSettings = JSON.parse(localStorage.getItem('settings') || "{}");
	// 	return { ...defaultSettings, ...loadedSettings};
	// }

	skipSlide(slide) {
		return !slide.title
		|| slide.title === "Unofficial Road to Dynamic Server Meshing"
		|| slide.subtitle === "How to navigate this presentation"
	}

	optimizeSlides(optimizeSlides) {
		let ignoredImageURLs = [];
		return optimizeSlides
			.map((slide, i) => {
				if (i === 2) {
					ignoredImageURLs.push(slide.imageURLs[0]);
				}
				if (slide.imageURLs) {
					slide.imageURLs = slide.imageURLs.filter(imageURL => !ignoredImageURLs.includes(imageURL));
				}
 				return slide;
			});
	}

	render() {
		return (
			<BrowserRouter>
				<Routes>
					<Route
						path="/wiki/"
						element={<Tech
							techOrder={this.state.techOrder}
							techOrderLowerCase={this.state.techOrderLowerCase}
							techsByName={this.state.techsByName}
							sources={sources}
							stats={stats}
							websiteUrl={URL}
						/>}
					/>
					<Route
						path="/prezi"
						element={<Presentation/>}
						exact
					/>
					<Route
						path="/"
						element={<NeoOverview
							stats={stats}
						/>}
					/>
				</Routes>
			</BrowserRouter>
		);
	}
}

export default App;
