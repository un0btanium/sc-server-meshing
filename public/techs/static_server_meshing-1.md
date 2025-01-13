# Static Server Meshing
### Overview
After the first version of Client OCS was released, work on Server Meshing could finally begin.

__Challenges:__

* A single game server is still overloaded with the amount of players/entities, and adding more increases CPU load even more.
* Using better server hardware isnt a scalable enough option, so we need to make game servers horizontally scalable instead.

__Solution:__ Static Server Meshing a first version of and intermediate step toward the planned Dynamic Server Meshing implementation, introduces distributed computation/simulation (released in Alpha 4.0)

__Goals:__

* Make use of Distributed Computation to have multiple game servers compute the same game world by sharing the computational load.

__Approach:__

* Introduce the concept of Entity Authority which allows the simulation load to be distributed/shared across multiple game servers:
* Each game server can now be assigned 'authority' over specific entities (meaning only that game server determines that entity's state).
* A game server could now simulate just a subset of entities of a game world, instead of all entities by default.
* Introduce the feature of Authority Transfers where the authority over an entity can be seamlessly handed off from one game server to another. Note: While playing, players can only move between game servers of the same game world, not between different game worlds.
* A new Hybrid service is introduced (initially called the Replication Layer, which is also the cornerstone of Persistent Entity Streaming):
* Connects to and coordinates the communication between clients, game servers and the databases.
* Relays entity state updates between clients and game servers.
* Determines which objects should be loaded via OCS on which client and game server.
* Also manages the Shard as a whole, populating the EntityGraph, starting up the game servers and connecting them to the Hybrid.
* Consists of multiple components: Replicant, Gateway, Atlas, Scribe. These will be turned into their own scalable services later.
* New terminology specific to Server Meshing is introduced:
* A game world that is simulated by multiple meshed game servers is referred to as a 'Shard' (a Game World Shard, not Database Shard!)
* A game server is sometimes referred to as 'Server Node' as it is now part of a larger network/mesh.
* For the static version of Server Meshing, limitations are set in place (which will be lifted under Dynamic Server Meshing):
* The game world is spatially split into multiple sections and each game server is responsible/limited to simulating one such section.
* These sections limit the area a game server can have authority over.
* The area of these sections stays fixed/static, as well as the amount of game servers that compute the same game world stays fixed.
* Design for Server Meshing was changed end of 2020/early 2021 to utilize the Replication Layer as a 'middle man' service (instead of using direct server-to-server communication which may have failed to provide the required performance).
* The first version released as part of the Alpha 4.0 Preview together with Pyro. Each solar system was split and run by 5 game servers for a total of 10 game servers for 500 players.
