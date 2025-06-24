import React, { Component } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom'; // TODO rework nagivation
// import update from 'immutability-helper';

import "bootstrap/dist/css/bootstrap.min.css";
import "./theme/bootstrap.css";
import './App.css';

import Tech from './components/tech.component';
import Presentation from './components/presentation.component';
import NeoOverview from './components/neo-overview.component';

import techs from './data/techs.json';
import sources from './data/sources.json';
import stats from './data/stats.json';

const URL = "https://sc-server-meshing.info/wiki/";

// TODO only show one slide at a time? we now lost comparisons when using the slide switch of old presentation (next/previous button for slides as well?) 

class App extends Component {

	constructor(props) {
		super(props);

		let techOrder= []; // TODO unnnecessary since it is now a proper array
		let techOrderLowerCase= [];
		let techsByName = {};
		
		for (let tech of techs) {
			tech.markup = new Set();
			techsByName[tech.title.toLowerCase()] = tech; // TODO markupFileName?
			techOrder.push(tech.title);
			techOrderLowerCase.push(tech.title.toLowerCase()); // TODO markupFileName?
		}

		this.state = {
			techOrder: techOrder,
			techOrderLowerCase: techOrderLowerCase,
			techsByName: techsByName,
		};
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
