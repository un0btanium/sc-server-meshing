# Entity Spawn Batches & Entity Snapshots
### Overview
With the server now being able to notify the client to load entities into memory it was time to handle the loading part on the client.

__Challenges:__

* entities need to spawn in a consistent way on the client so that client and server end up with the same Entity Aggregates and Entity Hierarchy in memory

__Solution:__ Entity Spawn Batches & Entity Snapshots (released in Alpha 3.0)

__Requirement for:__ Client Object Container Streaming

__Goals:__

* handle the data send by the server on the client to load objects in the correct order into memory

__Approach:__

* the server groups entities which should spawn together into an Entity Spawn Batch
* the entities only become active (being computed in the game loop) once all entities in the batch are loaded
* for each entity, the server creates an Entity Snapshot (with the help of Serialized Variables) containing the entire state (all variables and their values) of the entity and sends it to the client (speculated: maybe just those that are non-default values)
* while the entities are being loaded they are not being networked yet to stay synchronized. The process of loading objects in the background takes time which can lead to the object state being different on the server and client. This is solved by the server sending a second Entity Snapshot once all entities are loaded. The client updates the state to be in line with the server and then the entities can become active and networked to stay in sync with continuous updates from the server
* Since networking can be started and stopped (thus network updates skipped) for individual entities any time, entities are not necessarily unloaded directly when they dont receive updates anymore. They might stick around in memory for a while and continue receiving updates again later. Then a Entity Snapshot is send again to ensure the entity has the right state.
