# Dynamic Server Meshing V1
### Overview
__Challenges:__

* With Static Server Meshing, the load can't be optimally balanced yet. Some game servers might be underutilized, others might be overloaded. This is also not efficient in terms of server cost, as underutilized game servers cost the same as optimially used and overloaded game servers.

__Solution:__ Dynamic Server Meshing Version 1

__Requirement for:__ Server Meshing

__Goals:__

* Re-assigned the Entity Zones on-demand anytime, even after initial shard setup.

__Approach:__

* Use the Entity Zones introduced with Static Server Meshing.
* Have an algorithm/heuristic check the load within each game server, then split the game world up into sections on-the-fly and re-assigned the different Entity Zones across the game servers of a mesh.
* Speculated: Might be the job of the Atlas services.
