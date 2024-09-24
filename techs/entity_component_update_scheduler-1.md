# Entity Component Update Scheduler
### Challenges:
* for Client Object Container Streaming it will be necessary to load and unload entities and start and stop sending state updates to the client to reduce RAM and CPU usage so we require information on when we can do that

__Solution:__ Entity Component Update Scheduler (released in 3.0, most likely a result of the Simulation Multithreading initiative)

__Requirement for:__ Serialized Variable Culling, Client Object Container Streaming

__Goals:__

* update all entity components on each game tick in the game loop on the server
* provide information of the distance and visibility of each entity in regards to each player
* limit network updates to the clients based on those distance and visibility information

__Approach:__

* the Entity Component Update Scheduler already provides the required information about distance, size and visibility of entities in relation to the players
* since 3.0, the server already used that info to be able to start and stop simulating individual components as well as start and stop sending network updates to client of entities that are too far away from all (!) the players in the level.
* each Component type can be given a different update policy for more fine control when they should be simulated/networked
* This already saves performance as not all entities are simulated and send network updates to the clients.
* However, this still sends entity updates to ALL clients if only a single player is near an entity, even tho other players might be far away from that entity (this was later changed with the Serialized Variable Culling feature)
* these network policies will play a vital role in server meshing to ensure player clients perform well when hundreds of entities are around a player by skipping network updates for far away entities (where such skips are noticed less) thus reducing load on the client CPU
* speculated: interpolation techniques might allow far away entities to still have smooth motion, even though their state might not be 100% accurate all the time
* for OCS, the Entity Component Update Scheduler will be used for the loading and unloading of entities because it already provides the required information about the distance, size and visibility of entities to the players
* The ECUS was updated in Alpha 3.17 improving the simulation performance greatly (made it entity-centric, use Zone Host Updates and more).
