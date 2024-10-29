# Object Container
### Introduction
Our multi-step journey to Dynamic Server Meshing begins with the creation of Object Containers.

__Challenges:__

* traditional game levels consist of a list of objects (static and dynamic) which are loaded all on level start behind a loading screen
* to eventually be able to create a seamless universe with no loading screens and thousand of players, we can't load all objects into our memory all at once since the large amount of data would exceed our memory capacity

__Solution:__ Object Containers, a major part of the whole Engine Rework

__Goals:__

* instead of designing a level, introduce the idea of level building blocks called Object Containers which make up individual parts of the level from which the entire level is made out of
* this will later allow parts of the level to be loaded and unloaded into/from the level at anytime while playing
* this requires the functionality to stream objects in and out of memory, even after the initial process of loading the level finished
* the current system does not allow for such functionality, so we need to implement a unified system which will allow objects to be loaded at any time
* it will then be used to build upon toward the final Server Meshing implementation where different parts of the level is going to be computed by different game servers.

__Approach:__

* put all unique objects referencing their resources (like geometry, assets and entity type) into their own Object Containers
* allow Object Containers to reference and have other Object Containers as children so that the final level emerges out of many nested Object Containers
* rework the existing levels to use the Object Containers and create all future content with Object Containers which requires changes to the engine editor
* on level start, load the level via the Object Containers. There does not exist any logic yet that loads Object Containers while playing and will be the functionality later introduced by Object Container Streaming which loads/unloads objects at any time
* Object Containers themselves were first introduced in Alpha 2.6.1 (Feb 2017) but many of the other features (Megamap, 64bit coordinates, Entity Components, etc.) made its debut with Alpha 3.0 (December 2017)
