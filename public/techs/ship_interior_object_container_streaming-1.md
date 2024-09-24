# Ship Interior Object Container Streaming
### Overview
__Solution:__ Ship Interior OCS, a sub-feature of OCS and an optimization for clients and servers

__Requirement for:__ Server Meshing

__Goals:__

* "When complete, streaming interior object containers in and out of ships based on distance will allow vehicles to have a higher performant stage of streaming used at far distances, to reduce CPU cost." - Release View
* reduce CPU and memory on client (and servers in server meshing)

__Approach (speculated):__

* split the exterior and interior of ships into separate Object Containers
* add additional OCS rules for loading and unloading rooms/zones and/or Object Containers of the ship interiors
* the player client does not have to load the interior of far away ships anymore
* speculated: in server meshing, a game servers don't have to load the interior of the ships, which are being computed by another game servers in the mesh/shard
* speculated: rooms with windows will have a different rule compared to rooms which are deeper inside the ships and/or have no windows
