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
