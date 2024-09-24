# Definitive State & Location Spawn IDs
### Overview
With the entities not being loaded and accessible in server memory anymore, some issues arose because of it that needed to be deal with before Server Object Container Streaming was able to come online.

__Challenges:__

* in some situations, especially when players are teleported into an unloaded area (e.g. when (re)spawning), where everything has to be loaded, certain entities have to be loaded before others, like the floor before spawning NPCs, otherwise NPCs fall and are never seen again (this was not an issue for Client OCS because there the second Entity Snapshots from the server was able to adjusted the position of NPCs again and move it on top of the floor)
* some components that are only executed on the server were not yet unloaded to the database (because they previously did not need to since they always stayed in memory)
* when a player connects, its player entity is always spawned at a SpawnLocation which in itself is an entity but that leads to an issue because the system only loads all entities including the SpawnLocation entity when players are nearby (how the system is setup, SpawnLocations cant be an exception and excluded from the streaming process)

__Solution:__ lots of bug fixing and the introduction of Location IDs

__Requirement for:__ Server Object Container Streaming

__Goals:__

* fix the remaining issues caused by not having all objects loaded in memory at all times anymore

__Approach:__

* load world geometry and other objects in the correct order to have them loaded just like they were persisted
* finish work to be able to persist all components in the game
* to fix the SpawnLocation issue, a two phase spawning process was introduced: When a player connects it loads the players LocationID which essentially is just a point in space. It is used to spawn in objects at that point which includes the SpawnLocation. Once that is loaded, the player is spawned and the world loads around the player
