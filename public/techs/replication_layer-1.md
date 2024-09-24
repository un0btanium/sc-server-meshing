# Replication Layer
### Overview
__Requirement for:__ Persistent Entity Streaming, Static Server Meshing

__Solution:__ Replication Layer (sometimes also called Hybrid service, since the Replication Layer will eventually be moved onto its own server, together with many more services, before all those are moved onto separate scalable servers again, see Replication Layer V2)

__Goals:__

* Create a new service that is going to sit in-between the player clients, game servers and the EntityGraph database and is responsible for OCS loading decisions, state networking, caching, persisting and initial game world seeding.
* Have this service run alongside the game server to get all this functionality online before moving it on its own server for Server Meshing (at which point the Replication Layer is called the Hybrid Service).
* This decouples the Replication/Networking of the (persistent) entity state from the simulation (game servers).

__Approach/Goals:__

* Instead of exchanging data directly, clients and game server(s) will communicate via the Replication Layer instead. The Replication Layer will relay the information to the clients and game servers that need it.
* The service has been rolled out in phases:
* In Alpha 3.13 or 3.14, a first version of the Replication Layer might have come online, mainly moving code around in the engine code to prepare for later features.
* Alpha 3.15 came online with an in-memory cache which introduced a new query system as well as inventories (including stow/unstow, utilizing the Global Database and the Global Persistence features, but not EntityGraph just yet).
* For Alpha 3.17, the OCS logic that is responsible for loading the game world was moved out of the game server code and into the Replication Layer code. It also came online with improvements to the OCS streaming bubble, allowing clients and servers to load the same entities in parallel and have different streaming bubble sizes for clients (prior they had the same size and the client was only notified after the server completed loading on its side). The entity state networking part of OCS might have been moved into the Replication Layer with Alpha 3.17 as well.
* With Alpha 3.18, the EntityGraph database is hooked up to the Replication Layer (PES comes online for the first time).
* With Alpha 3.23, the Replication Layer was split off from the game server and moved onto its own server instead, enabling Server Crash Recovery.
* Under Dynamic Server Meshing, the Replication Layer will be horizontally scaled, by splitting off the individual services it consists of, so that they can be scaled independently, serving many more clients and game servers. This is how Server Meshing is going to scale up and allow for more and more players in the same game world/mesh/shard.
