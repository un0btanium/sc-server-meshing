import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import {useNavigate, useSearchParams} from 'react-router-dom';

import '../neo.css';

export default function NeoOverview(props) {
	useLayoutEffect(() => {
		document.body.classList.add('neo');
		return () => {
			document.body.classList.remove('neo');
			let root = document.getElementById('root');
			root.style = "";
		}
	}, []);

	let [searchParams] = useSearchParams();

	const containerRef = useRef(null);
	const [scale, setScale] = useState(1.0);
	// const [origin, setOrigin] = useState("top left");

	const scaleContent = () => {
		let root = document.getElementById('root');

		if (containerRef.current) {
			const viewportHeight = window.innerHeight;
			const viewportWidth = window.innerWidth;

			const scaleFactorWidth = viewportWidth / 1919;
			const scaleFactorHeight = viewportHeight / 991;
			const scaleFactor = scaleFactorWidth < scaleFactorHeight ? scaleFactorWidth : scaleFactorHeight;

			root.style.width = viewportWidth + 'px'
			root.style.height = viewportHeight + 'px'

			setScale(scaleFactor);
			// setOrigin("left top");
		}
	};

	useEffect(() => {
		scaleContent();
		window.addEventListener('resize', scaleContent);
		return () => window.removeEventListener('resize', scaleContent);
	}, []);


	
	const navigate = useNavigate();
	const link = (e, techName) => {
		e.target.setAttribute("class", e.target.getAttribute("class") + " clicked");
		let offsetParent = e.target.offsetParent
		while (offsetParent !== undefined && offsetParent !== null) {
			e.target.offsetParent.offsetParent.setAttribute("style", "z-index: 1000;")
			offsetParent = offsetParent.offsetParent;
		}
		// Array.from(document.getElementsByClassName("box-faint")).forEach((elem => elem.setAttribute("style", "z-index: 998")));
		setTimeout(() => navigate('/wiki/?tech=' + encodeURIComponent(techName) + "&neo"), 800);
	};

	let nextTech = searchParams.get('nextTech');
	if (nextTech === null) {
		nextTech = "Road to Dynamic Server Meshing - Introduction"
	}
	const createTechBox = (techDisplayName, boxSize, state, linkName=techDisplayName) => {
		linkName = linkName.replaceAll("<br/>", "");
		let element = <div className={"box " + boxSize + " " + state + (nextTech === linkName ? " blink" : "")} onClick={(e) => link(e, linkName)} dangerouslySetInnerHTML={{ __html: techDisplayName }}></div>
		return element
	}

	return (
		<>
			<div className="container" style={{ transform: `scale(${scale})`, transformOrigin: "top left" }} ref={containerRef}>
				<div className="header">
					<div className="logo-heading">
						<div className="logo">
							<img src="logo.png" alt="Logo" width="181" height="133" />
						</div>
						
						{/* TODO dynamic stats */}
						<div>
							<h1>Unofficial Road to Dynamic Server Meshing</h1>
							<p className="lead">{props.stats.subtitle}</p>
							<p>Made By: {props.stats.authors} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Last Updated: {props.stats.lastUpdated} (Current Live Patch: {props.stats.livePatch})</p>
						</div> 
					</div>
					<div className="list-boxes">
						<div className="list-header">
							<ul>
								<li>
									<span className="color-indicator bg-green"></span>
									&nbsp;First Version Released
								</li>
								<li>
									<span className="color-indicator bg-orange"></span>
									&nbsp;Functional Internally
								</li>
								<li>
									<span className="color-indicator bg-blue-light"></span>
									&nbsp;In Development
								</li>
								<li>
									<span className="color-indicator bg-red"></span>
									&nbsp;Planned/Status Unknown
								</li>
							</ul>
						</div>
						
						<div className="header-boxes">
							{createTechBox("Introduction", "", "bg-blue-dark", "Road to Dynamic Server Meshing - Introduction")}
							{createTechBox("Preamble", "", "bg-blue-dark", "Road to Dynamic Server Meshing - Preamble")}
							{createTechBox("Sources", "", "bg-gray")}
						</div>
					</div>
				</div>

				<div className="content">
					<div className="box-faint left">Object Containers Streaming (OCS)</div>

					<div className="box-faint right">Server Meshing (SM)</div>

					<div className="row">
						<div className="col">
							<div className="col-header flex-column justify-between">
								<div className="info">
									<p className="text-blue-light">Developed</p>
									<p className="text-green-light">Released to Live</p>
								</div>
								<h2 id="major_tech_heading">Major Tech</h2>
							</div>

							<h2 id="minor_tech_header">Minor Tech</h2>

							<div className="flex-column" id="other_tech">
								<h2 id="other_tech_header">Other Tech</h2>
								{createTechBox("Projectile Manager", "box-sm", "bg-green")}
								{createTechBox("Actor Networking Rework", "box-sm", "bg-green")}
								{createTechBox("Subsumption AI", "box-sm", "bg-green")}
								{createTechBox("StarSim", "box-sm", "bg-green")}
							</div>
						</div>

						<div className="col">
							<div className="col-header">
								<div className="info">
									<p className="text-blue-light">-2014-2017</p>
									<p className="text-green-light">Alpha 3.0 (Dec 2017)</p>
								</div>
								{createTechBox("Object<br/> Container", "box-lg", "bg-green")}
							</div>
							<div className="col-content">
								<div className="arrow-up"></div>
								{createTechBox("Serialized Variables", "box-sm", "bg-green")}
								{createTechBox("64bit to 32bit converter", "box-sm", "bg-green")}
								{createTechBox("ZoneSystem", "box-sm", "bg-green")}
								{createTechBox("64bit ids & coordinates", "box-sm", "bg-green", "64bit floating point coordinates & 64bit integer entity id conversion")}
								{createTechBox("MegaMap", "box-sm", "bg-green")}
								{createTechBox("Multi-Threaded Loading & Execution", "box-sm", "bg-green")}
								{createTechBox("LUA Removal & C++ Entity Components", "box-sm", "bg-green")}
							</div>
						</div>

						<div className="col">
							<div className="col-header">
								<div className="info">
									<p className="text-blue-light">2016-2018</p>
									<p className="text-green-light">Alpha 3.3.5 (Nov 2018)</p>
								</div>
								{createTechBox("Client<br/> Object<br/> Container<br/> Streaming", "box-lg", "bg-green")}
							</div>
							<div className="col-content">
								<div className="arrow-up"></div>
								{createTechBox("Network/Entity Bind Culling", "box-sm", "bg-green")}
								{createTechBox("Serialized Variable Culling", "box-sm", "bg-green")}
								{createTechBox("Entity Spawn Batches & Entity Snapshots", "box-sm", "bg-green")}
								{createTechBox("Entity Ownership Hierarchy / Entity Aggregates", "box-sm", "bg-green")}
								{createTechBox("Entity Component Update Scheduler", "box-sm", "bg-green")}
							</div>
						</div>

						<div className="col">
							<div className="col-header">
								<div className="info">
									<p className="text-blue-light">2019</p>
									<p className="text-green-light">Alpha 3.8.0 (Dec 2019)</p>
								</div>
								{createTechBox("Server<br/> Object<br/> Container<br/> Streaming", "box-lg", "bg-green")}
							</div>
							<div className="col-content">
								<div className="arrow-up"></div>
								{createTechBox("pCache", "box-sm", "bg-green")}
								{createTechBox("Definitive State & Location Spawn IDs", "box-sm", "bg-green")}
								{createTechBox("Entity Streaming Manager & StarHash", "box-sm", "bg-green")}
								{createTechBox("Long Term Persistence", "box-sm", "bg-green")}
								{createTechBox("Ship Interior OCS", "box-sm", "bg-red", "Ship Interior Object Container Streaming")}
							</div>
						</div>

						<div className="col">
							<div className="col-header">
								<div className="info">
									<p className="text-blue-light">2020-2023</p>
									<p className="text-green-light">Alpha 3.18.0 (March 2023)</p>
								</div>
								{createTechBox("Persistent <br/>Entity<br/> Streaming", "box-lg-landscape", "bg-green")}
							</div>
							<div className="col-content double-col">
								<div className="row">
									<div className="col">
										<div className="arrow-up"></div>
										{createTechBox("Stow & Unstow", "box-sm", "bg-green")}
										{createTechBox("Physicalized Items and Inventory", "box-sm", "bg-green")}
										{createTechBox("Local, External & Personal Inventory", "box-sm", "bg-green")}
										{createTechBox("Global Persistence", "box-sm", "bg-green")}
										{createTechBox("EntityGraph", "box-sm", "bg-green")}
										{createTechBox("Global Database", "box-sm", "bg-green")}
										{/* TODO <div className="box box-sm bg-lila">iCache (Failed State)</div> */}
									</div>
									<div className="col">
										<div className="arrow-up"></div>
										{createTechBox("Replication Layer", "box-sm", "bg-green")}
										{createTechBox("Shard Manager", "box-sm", "bg-green")}
										{createTechBox("Fleet Manager", "box-xsm", "bg-green", "Service Fleet Manager")}
										{createTechBox("Service Migration & Creation", "box-sm", "bg-green")}
										{createTechBox("Crash Recovery & Player Reconnects", "box-sm", "bg-green", "Game Server Crash Recovery & Client Reconnects")}
										{createTechBox("Player Item Shard Transitions", "box-sm", "bg-red")}
										{createTechBox("Server Nodes", "box-sm", "bg-green")}
										{createTechBox("Shards", "box-sm", "bg-green")}
									</div>
								</div>
							</div>
						</div>

						<div className="col">
							<div className="col-header">
								<div className="info">
									<p className="text-blue-light text-uppercase">2019-TBD</p>
									<p className="text-green-light text-uppercase">TBD</p>
								</div>
								{createTechBox("Static <br/>Server<br/> Meshing", "box-lg", "bg-orange")}
							</div>
							<div className="col-content">
								<div className="arrow-up"></div>
								{createTechBox("Replication Layer Split", "box-sm", "bg-green", "Hybrid Service (Replication Layer Split)")}
								{createTechBox("Scribe", "box-xsm", "bg-green")}
								{createTechBox("Gateway", "box-xsm", "bg-green", "Gateway Layer & Gateway Services")}
								{createTechBox("Replicant", "box-xsm", "bg-green", "Replication Layer & Replicant Services")}
								{createTechBox("Atlas", "box-xsm", "bg-orange")}
								{createTechBox("Entity Zones", "box-sm", "bg-orange")}
								{createTechBox("Entity Authority", "box-sm", "bg-green")}
								{createTechBox("Connection Process & States Rework", "box-sm", "bg-green")}
								{createTechBox("Time & Synchronization Improvements", "box-sm", "bg-green")}
								{/* TODO <div className="box box-sm bg-lila">First Solution (Failed State)</div> */}	
							</div>
						</div>

						<div className="col">
							<div className="col-header">
								<div className="info">
									<p className="text-blue-light text-uppercase">TBD</p>
									<p className="text-green-light text-uppercase">TBD</p>
								</div>
								{createTechBox("Dynamic <br/>Server<br/> Meshing", "box-lg", "bg-blue-light")}
							</div>
							<div className="col-content min-height">
								<div className="arrow-up"></div>
								{createTechBox("Replication Layer V2", "box-sm", "bg-red", "Replication Layer Version 2 (Hybrid service breakup)")}
								{createTechBox("Dynamic Server Meshing V2", "box-sm", "bg-red")}
								{createTechBox("Dynamic Server Meshing V1", "box-sm", "bg-red")}
								{createTechBox("Entity Authority Load Balancer", "box-sm", "bg-red")}
							</div>
						</div>

						<div className="col">
							<div className="col-header">
								<div className="info">
									<p className="text-blue-light text-uppercase">TBD</p>
									<p className="text-green-light text-uppercase">TBD</p>
								</div>
								{createTechBox("Single<br/> Shard", "box-lg", "bg-red")}
							</div>
							<div className="col-content min-height">
								<div className="arrow-up"></div>
								{createTechBox("Layers", "box-sm", "bg-red", "Layers/Layering")}
								{createTechBox("Server Node Multithreading Scaleup", "box-sm", "bg-red")}
								{createTechBox("Specialized Netcode R&D", "box-sm", "bg-red", "Specialized Netcode Research and Development")}
							</div>

							<div id="logo-bottom" className="logo">
								<img src="logo.png" alt="Logo" width="181" height="133" />
								<span><a href="https://sc-server-meshing.info">sc-server-meshing.info</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
								<a href="https://sc-server-meshing.info/wiki">sc-server-meshing.info/wiki</a>
							</div>
						</div>
					</div>
				</div>
				
				<p id="bottom-text">The information presented in this presentation is not officially endorsed by Cloud Imperium and doesn't reflect the views or opinions of Cloud Imperium or anyone officially involved in producing or managing Star Citizen and Squadron 42</p>
			</div>
		</>
	);
}