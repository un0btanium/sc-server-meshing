# Atlas
### Overview
Atlas is one of the components of the initial Hybrid Service, but will be its own scalable service later on.

__Challenges:__

* Entity Authority introduced the functionality of game servers/server nodes to be able to compute only specific entities of the level rather than the entire level by default.
* However something needs to keep track, determine and assign this authority to the server nodes.

__Solution:__ Atlas service

__Requirement for:__ Server Meshing

__Goals:__

* Create a service that manages the Entity Authority for the server nodes/game servers of a Shard/Mesh.

__Approach:__

* Atlas determines and keeps track of which server node has authority over which entities.
* The game world is going to be split into separate sections with the help of Entity Zones (Zone System).
* Under Static Server Meshing, these Entity Zones are assigned to game servers on initial shard-start and stay fixed/unchanged afterwards (meaning statically assigned).
* Under Dynamic Server Meshing, these Entity Zones can be re-assigned to different game servers on-demand any time (meaning dynamically assigned).
* Atlas tells each game server/server node which entity it has authority over. After that, the Entity Authority logic on the game server is responsible for executing the correct logic on the entity state (run the simulation code for that entity or not).
* Authority can be transferred from one game server to another. E.g. when players and entities (like a ship) move through the level and from one Entity Zone into another (simulated by different game servers). In such a case, both game servers might already have the entities loaded into memory to allow for a seamless transition.
* Speculated: this is going to be expanded upon and turned into the Loader Balancer for Dynamic Server Meshing which will try to optimally distribute entities across all game servers continuously on-demand.
