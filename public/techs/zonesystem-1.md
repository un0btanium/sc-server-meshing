# ZoneSystem
### Challenges:
* since the game is going to feature a lot of moving and rotating entities (e.g. planets, spacestations, ships, public transport, other vehicles) a lot of objects inside all of those entities would have to update their position in the level as well
* objects can be inside of other objects thus objects would have to be moved multiple levels deep
* this would lead to a lot of computational load and has a high chance of leading to issues like movement and hitbox jankiness
* currently each code system (rendering, network updates, physics) has its own custom partitioning system some of which dont work well in these new large 64bit coordinate systems

__Solution:__ ZoneSystem and its Zones, a unified, custom spatial partitioning system (despite its name, it has nothing to do with zoning/instacing of game areas like many MMOs do)

__Requirement for:__ Object Containers, 64bit to 32bit converter, OCS, Server Meshing

__Goals:__

* allow for large groups of objects to move and rotate with little CPU computation required by introducing zones
* have these zones be a unified system for rendering, visibility occlusion, network optimizations, physics, level streaming, AI, etc.

__Approach:__

* this replaces the Octree datastructure previously used to partition the game level into cubic, immovable chunks
* the new zones can be of different sizes
* each planet, station, ship, room etc. receives its own zone and each zone has its own 64bit floating point coordinate system
* objects which are inside a zone are positioned relative to that zone, not to the level world coordinates
* if a zone moves, its coordinate system moves with it and that in turn moves all objects inside
* therefore, to move all objects inside of a ship/planet/etc., only the position of the ship ("zone host") has to be updated
* this makes large ships essentially its own moving level inside another even larger level
* zones can be nested, thus smaller zones can be in other zones and move with the parent zone like all the other objects, for example solar system->planet->landing zone->room->ship->vehicle
* those smaller zones can enter and leave larger zones (like the zone of a vehicle parked inside the zone of a ship)
* when objects move from one zone into another the object coordinates have to be correctly calculated to ensure a smooth transition from one coordinate system to the other
* initial work was done/completed in August 2014
* was changed to an AABB tree data strucuture in June 2016
* (speculated: it is highly likely that zones are going to be used for OCS and Server Meshing for networking, streaming and to partition the game world into sections to be run on separate game servers)
