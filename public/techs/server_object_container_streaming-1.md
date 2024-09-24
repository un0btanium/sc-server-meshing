# Server Object Container Streaming
### Overview
With Client Object Container Streaming (COCS) we have improved the performance and memory requirements on the client side which improved the performance for the players noticeably. On the server, we can now increase the level size by adding more objects into the level, for example more areas like planets and locations without effecting the performance on the client as much as it did.

__Challenges:__

* the server still has to compute all entities and have all Object Containers loaded in memory
* while adding more objects into the level does not effect the player client as much anymore, the server still has to load all and compute most of them, no matter if players are nearby or not
* adding more and more objects into the level starts to exceed the server CPU and memory load which prevents us to create even larger levels with more content

__Solution:__ Server Object Container Streaming (sometimes Server Side OCS or SSOCS or SOCS), Interest Management for the game server

__Goals:__

* Reduce the memory requirements on the server.
* Reduce the load on the CPU on the server.
* This is going to help performance later under Server Meshing, where multiple servers will simulate a game world, but don't have to load the entire game world and instead only their little corner section of it.

__Approach:__

* Dynamically stream game objects in and out of the level on the server while players are moving around
* Serialize entities via Serialized Variables and stream/save/load entity data into and out of a database (pCache, later iCache) to free up memory, thus the server only has a portion of the entire database loaded
* Thus only load the level areas where players are nearby to reduce the memory consumption
* With certain areas of the level not loaded, the amount of entities that have to be computed on the CPU is being reduced and performance does not deteriorate on the server anymore
