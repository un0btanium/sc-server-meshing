# Road to Dynamic Server Meshing - Introduction
### What to expect from this presentation:
This presentation is offering a centralized place about everything that is known about Star Citizen's Dynamic Server Meshing implementation. We will go over the the major and minor technologies that create the overall functionality of Dynamic Server Meshing. The official sources used are made available as well.

There is also an in-depth, step-by-step introductory topic as part of the Preamble. We go over some of the basic concepts in hardware, software and video games to build up a basic understanding of their inner workings and limitations. Of course, you are free to skip it and jump straight into the Object Container topic. But I will always recommend checking out the introductory topics first if you do have the time and interest.

__TLDR:__ This journey can be categorized and summarized on a high-level into the following five big milestones or functionalities:

* Engine Rework: The majority of the engine was replaced with new systems. StarEngine was born. Most of these changes released with Alpha 3.0 in 2017.
* (Area of) Interest Management System: Optimized the loading and networking aspects. Released in two parts as Object Container Streaming in 2018 and 2019.
* Persistence: Introduced saving and loading game state to/from a database. Also layed the foundational architecture for Server Meshing. Released in 2023.
* Distributed Simulation: Introduced by Server Meshing. Multiple game servers simulate different parts of the same game world. Alpha 4.0 Preview 2024.
* Architecture Scaleup: All code becomes highly scalable in a microservice architecture to allow many thousand of players to play in the same game world. 

![Image](/images/road_to_dynamic_server_meshing_introduction/image-00.png)

### Visual Examples
Throughout this presentation, I tried to incorporate images to help visualize how these technologies work and what their purposes are.

So lets get started! The usual game level is three dimensional and therefore has three axis (x, y and z). We will leave out the z dimension and represent the level as a flat 2D area. We do this for simplicity reasons, but remember that all the presented technologies are actually operating in 3D. A first example of a level can be seen in the image below. It features two players (blue and red) inside the level.

On the following slides you find further explanations and visual representations of technical topics that will lay the foundation for all the subsequent technologies.

![Image](/images/road_to_dynamic_server_meshing_introduction/image-01.png)

### Quick Disclaimer before we start
Even though there was a great effort made to use official information and sources, be aware that some aspects of how these technologies work are deduced and therefore speculated. Whenever that was the case, I tried to make sure that it was noted as such, either in the slide title or in the text itself, so have a lookout for them. Therefore, the information presented here are my own understanding at this moment in time and are therefore subject to change. In the light of additional insights, the information in this presentation will be updated accordingly. Feel free to contribute with information that I may have missed.

If you feel like something is missing or you have a question or just want to say hello, feel free to notify me on Spectrum:

[https://robertsspaceindustries.com/spectrum/community/SC/forum/3/thread/road-to-dynamic-server-meshing-tech-overview-with-](https://robertsspaceindustries.com/spectrum/community/SC/forum/3/thread/road-to-dynamic-server-meshing-tech-overview-with-)