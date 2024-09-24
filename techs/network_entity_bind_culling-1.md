# Network/Entity Bind Culling
### Overview
With Serialized Variable Culling each client only received network updates of entities which are near that player.

__Challenges:__

* however, the player still had to load all entities on level start and keep them loaded in memory even if they were far away and not being networked

__Solution:__ Network Bind Culling (released in Alpha 3.3, also referred to as Entity Bind Culling later on)

__Requirement for:__ Client Object Container Streaming

__Goals:__

* load and unload entities to/from memory on the client based on the position position in the level

__Approach:__

* the server tells the client when to load which entities into memory (by using the Object Containers and their identifiers)
* entities are loaded based on the information provided in the Entity Component Update Scheduler
* we are finally at a position where the client has a truly partial view into the game world on the server, completing the functionality of Client OCS
* the game world on the server could now be increased, adding more locations, without requiring clients to load them into memory as well
