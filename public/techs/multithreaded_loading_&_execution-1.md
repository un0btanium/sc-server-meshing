# Multi-Threaded Loading & Execution
### Overview
In any game there are many Resources (e.g. textures, geometry meshes), which have to all be loaded into memory.

__Challenges:__

* loading large objects like spaceships into memory caused noticeable stuttering and freezes because the loading and following initialization process can take long amounts of time (>200ms) and this process being performed by the main thread on which the game simulation logic was being executed on, lead to those stutters and freezes.
* the game already loads Resources (like textures and geometry meshes into) the GPUs VRAM in a parallelized and organized way. However, with the introduction of Object Containers, there needed to be additional logic to ensure that Resources are loaded only once whenever they shared by multiple Object Containers and those Object Containers are loaded at the same time in parallel.

__Solution:__ Multi-Threaded Game Simulation and Loading of Resources and Entity Components, an long-going project to move loading into background threads and optimize the logic for parallel loading (work was on-going well into the Alpha 3.x releases)

__Requirement for:__ Object Containers, Object Container Streaming

__Goals:__

* load each Resource only once instead of multiple times to save memory while being able to load multiple Object Containers in parallel which may or may not share one or more Resources
* run the game simulation in multiple threads to allow for more entities to be computed in one game tick on the server and client

__Approach:__

* put the loading process of Object Containers, their Resources and Entity Component into a background thread
* use Fibers (similar to Coroutines) to have more control over the loading process of Object Containers
* keep track of the already loaded resources to reuse them for multiple object containers instead of loading them multiple times
* these changes were partially rolled out with Alpha 3.2, reducing stuttering and freezing noticeably
* with the introduction of Entity Components, the simulation logic was changed to have Component updates be executed in parallel. Therefore, the game simulation part of the game loop has been multithreaded as well.
* This is part of the Entity Component Update Scheduler. It also allows the simulation of individual components to be paused. This was based on distance to players, meaning that certain entities might have been loaded, but were not simulated until players were moving closer.
* furthermore, the loading process and the game simulation logic is not allowed to make changes to the same memory areas and therefore have to be managed to not interfere with each other. Otherwise, this may lead to unexpected behavior, like data corruption and game crashes. Therefore, the loading process has to wait until the game simulation of the current game tick has completed and only then add any loaded objects to the level. Likewise, the game simulation has to wait when the loading process is busy with adding objects.
* Entity-Aggregates and Zone Hosts help to optimize the multithreading of the simulation, by grouping entities that should be updated together.
