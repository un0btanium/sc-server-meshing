# Entity Zones
### Overview
__Challenges:__

* Speculated: Figuring out which entity should be simulated on which game server on a per-entity basis might not be efficient enough or even necessary.

__Solution:__ Entity Zones (initially maybe referred to as "Territories")

__Requirement for:__ Server Meshing

__Goals:__

* Use a spatial partitioning datastructure to group up entities for bulk authority assignment.

__Approach:__

* Split the game world into separate sections/zones, grouping up all the entities within.
* Use the existing ZoneSystem to form these separate sections, called Entity Zones.
* Instead of assigning individual entities, these Entity Zones can be assigned to the game servers of a mesh.
* When assigned to a game server, ALL entities within an Entity Zone are then computed by that game server (However, Dynamic Server Meshing V2 will optimize this further).
* Under Static Server Meshing, Entity Zones are assigned only once at initial shard setup and stay on that game server.
* Under Dynamic Server Meshing V1, Entity Zones can be reassigned anytime to another game server.
* Under Dynamic Server Meshing V2, an Entity Zone can be even further subdivided. These additional sections are called "simulation islands". They too can then be assigned to separate game servers.
