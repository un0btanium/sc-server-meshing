# Dynamic Server Meshing V2
### Overview
__Challenges:__

* Some Entity Zones might still become too crowded, especially mid- to large-sized ones.

__Solution:__ Dynamic Server Meshing V2, "Simulation Islands"

__Requirement for:__ Server Meshing

__Goals:__

* Allow the load of a single Entity Zone to be further distributed onto separate game servers.

__Approach:__

* Under Dynamic Server Meshing V2, an Entity Zone can be even further subdivided. The entities within the Zone are organized into different groups, "based on which objects can interact/collide with each other". These additional groups are called "simulation islands".
* This way, an Entity Zone does not have to be simulated by one game server, but can be simulated by multiple game servers, if the load demands it. This might especially necessary in highly crowded areas of mid- to large-sized Entity Zones.
