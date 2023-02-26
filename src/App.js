import React, { Component } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom'; // TODO rework nagivation


import "bootstrap/dist/css/bootstrap.min.css";
import "./theme/bootstrap.css";
import './App.css';

import Tech from './components/tech.component';
import Presentation from './components/presentation.component';

import slides from './data/slides.json';
import sources from './data/sources.json';
import stats from './data/stats.json';

const URL = "https://sc-server-meshing.info/wiki/";

class App extends Component {

	constructor(props) {
		super(props);

		this.openTech = this.openTech.bind(this);

		const searchParams = new URLSearchParams(window.location.search)
		let techName = searchParams.get('tech')  ? searchParams.get('tech') : undefined;
		let slideName = searchParams.get('slide') ? searchParams.get('slide') : undefined;
		// console.log(techName, slideName);

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



		slides = this.optimizeSlides(slides);
		for (let slide of slides) {

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

		let techNameLowerCase = (techName || techOrder[0]).toLowerCase();
		let currentTech = techOrder[0];
		let currentSlide = undefined;
		if (techsByName[techNameLowerCase]) {
			currentTech = techsByName[techNameLowerCase].name;
			let specificSlides = techsByName[techNameLowerCase].slides.filter(s => s.subtitle === slideName);
			if (specificSlides.length > 0) {
				currentSlide = specificSlides[0];
			}
		} else {
			techNameLowerCase = techOrderLowerCase[0];
		}

		let techIndex = techOrderLowerCase.indexOf(techNameLowerCase);
		let previousTech = techOrder[techIndex === 0 ? techOrder.length-1 : techIndex-1];
		let nextTech = techOrder[techIndex === techOrder.length ? 0 : techIndex+1];
		
		// console.log(techIndex, previousTech, currentTech, nextTech);

		this.state = {
			slides: slides,

			techOrder: techOrder,
			techOrderLowerCase: techOrderLowerCase,
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

	skipSlide(slide) {
		return !slide.title
		|| slide.title === "Unofficial Road to Dynamic Server Meshing"
		|| slide.subtitle === "How to navigate this presentation"
	}

	openTech(techName) {
		let techIndex = this.state.techOrderLowerCase.indexOf(techName.toLowerCase());
		let techOrder = this.state.techOrder;
		let previousTech = techOrder[techIndex === 0 ? techOrder.length-1 : techIndex-1];
		let currentTech = techOrder[techIndex];
		let nextTech = techOrder[techIndex === techOrder.length-1 ? 0 : techIndex+1];

		// console.log(techIndex, previousTech, currentTech, nextTech);

		this.setState({
			techIndex,
			previousTech,
			currentTech,
			nextTech
		});
		window.scrollTo(0, 0);	
	}

	render() {
		return (
			<BrowserRouter>
				<Routes>
					<Route
						path="/wiki/"
						element={<Tech
							isPresentationMode={this.state.isPresentationMode}
							techNames={this.state.techOrder}
							tech={this.state.techsByName[this.state.currentTech.toLowerCase()]}
							previousTech={this.state.previousTech}
							nextTech={this.state.nextTech}
							openTech={this.openTech}
							slide={this.state.currentSlide}
							sources={sources}
							stats={stats}
							websiteUrl={URL}
						/>}
					/>
					<Route
						path="/"
						element={<Presentation/>}
						exact
					/>
				</Routes>
			</BrowserRouter>
		);
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
}

export default App;
