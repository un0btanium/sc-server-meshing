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


### Recap of major tech features releasing

* Alpha 2.6 - Jan 2017 - Object Containers (preview/feature parity)
* Alpha 3.0 - Dec 2017 - Object Containers, Entity Components, 64bit coordidnates, Zone System, planet tech, new render pipeline, and many more (Large Engine Rework) (24 -> 50 players per server)
* Alpha 3.3 - Nov 2018 - Client OCS
* Alpha 3.8 - Dec 2019 - Server OCS
* Alpha 3.8.2 - Feb 2020 - Long Term Persistence DB (later reworked into the Global DB), less wipes between patches
* Alpha 3.13/3.14 - Apr/Aug 2021 - Preparations for the Replication Layer in the game server code
* Alpha 3.15 - Nov 2021 - Release of the Global Database, Global Persistence and Physicalized Items and Inventory (uses RL to make backend DB calls)
* Alpha 3.17 - Apr 2022 - Entity State Networking through the Replication Layer (networking part of OCS moved into RL)
* Alpha 3.18 - Mar 2023 - Gen12 + EntityGraph Database + OC Loading via Replication Layer (+cache for Global DB queries in EntityGraph services, all of OCS in RL)
* Alpha 3.23 - May 2024 - Replication Layer moved out of the game server into its own server (Hybrid Service)
* Tech Channel Previews - 2024 - Static Server Meshing
* Alpha 3.24 - Aug 2024 - Replication Message Queue Refactor
* Alpha 4.0 - Dec 2024 - Static Server Meshing with Jumppoints and the Pyro solar system (~150 -> ~600 players per shard)
* Alpha 4.? - Work In Progress - Dynamic Server Meshing V1
