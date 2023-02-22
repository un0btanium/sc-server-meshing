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

		this.openTech = this.openTech.bind(this);

		const searchParams = new URLSearchParams(window.location.search)
		let techName = searchParams.get('tech')  ? searchParams.get('tech') : undefined;
		let slideName = searchParams.get('slide') ? searchParams.get('slide') : undefined;

		let techOrder= [];
		let techOrderLowerCase= [];
		let techsByName = {};

		let tech = {
			name: "Overview",
			slides: [],
			sources: []
		};
		techOrder.push(tech.name);
		techOrderLowerCase.push(tech.name.toLowerCase());
		techsByName[tech.name.toLowerCase()] = tech;

		slides = this.optimizeSlides(slides);
		for (let slide of slides) {

			if (!slide.title) {
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

	openTech(techName) {
		let techIndex = this.state.techOrderLowerCase.indexOf(techName.toLowerCase());
		let techOrder = this.state.techOrder;
		let previousTech = techOrder[techIndex === 0 ? techOrder.length-1 : techIndex-1];
		let currentTech = techOrder[techIndex];
		let nextTech = techOrder[techIndex === techOrder.length-1 ? 0 : techIndex+1];

		console.log(techIndex, previousTech, currentTech, nextTech);


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
			<Container style={{ marginTop: '25px', marginBottom: '50px' }}>
				<BrowserRouter>
					<Routes>
						<Route
							path="/sc-server-meshing/"
							element={
								<Tech
									techNames={this.state.techOrder}
									tech={this.state.techsByName[this.state.currentTech.toLowerCase()]}
									previousTech={this.state.previousTech}
									nextTech={this.state.nextTech}
									openTech={this.openTech}
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
