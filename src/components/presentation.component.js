import React from 'react';

export default function Presentation(props) {
	return (
		<>
			<div>
				<iframe
					title="Unofficial Road to Dynamic Server Meshing"
					src="https://prezi.com/p/xk5ilzstjrhy/embed/"
					id="iframe_container"
					frameBorder="0"
					webkitallowfullscreen=""
					mozallowfullscreen=""
					allowFullScreen=""
					allow="autoplay; fullscreen"
					style={{ "position": "absolute", "height":"100%", "width":"100%" }}
				></iframe>
				<div className="link-overlay-container-nonsticky">
					<a
						className="mode-switch-container"
						href={process.env.PUBLIC_URL + "/wiki"}
					>
						<img
							className="mode-switch"
							style={{"border": "0px"}}
							src={process.env.PUBLIC_URL + "/wiki-mode.png"}
							border="0"
							alt="Follow me"
						/>
					</a>
					<a
						className="follow-me-container"
						href="https://ko-fi.com/Q5Q6CF5CG"
						target="_blank"
						rel="noreferrer"
					>
						<img
							className="follow-me"
							style={{"border": "0px"}}
							src={process.env.PUBLIC_URL + "/follow-button.png"}
							border="0"
							alt="Follow me"
						/>
					</a>
					<a 
						className="spectrum-logo-container"
						href="https://robertsspaceindustries.com/spectrum/community/SC/forum/3/thread/road-to-dynamic-server-meshing-tech-overview-with-"
						target="_blank"
						rel="noreferrer"
					>
						<img
							className="spectrum-logo"
							src={process.env.PUBLIC_URL + "/spectrum-logo.png"}
							alt="Spectrum forum post"
						/>
					</a>
					<a 
						className="shinytracker-logo-container"
						href="https://shinytracker.app/"
						target="_blank"
						rel="noreferrer"
					>
						<img
							className="shinytracker-logo"
							src={process.env.PUBLIC_URL + "/shinytracker-logo.png"}
							alt="ShinyTracker website"
						/>
					</a>
				</div>
			</div>
		</>
	);
}