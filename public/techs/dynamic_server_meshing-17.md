### Replicant & Gateway 2/3 - Entity State Network Replication
The entity state updates from server nodes are send to select clients and other server nodes of the Shard. This was previously determined by Serialized Variable Culling (part of OCS) in the game server logic, but now done by the Replicant service.

__Note:__ How and where exactly the decision is being made (Replicant and/or Gateway) was not yet clear to me. But we do know that the Replicant is copying parts of the EntityGraph database into its own memory - to cache entity states for quick read and writes, to know about the position of all entities. We also know that the Gateway is supposed to be a very lightweight.

__Speculated:__ Therefore, the Replicant might already be determining to which client(s) it has to be send and the Gateway just replicates and sends the data to the correct clients.

This allows players to receive entity state updates from multiple server nodes. This enables players to look into multiple server nodes and see entities and other players that are computed on other server nodes. This is also used when two server nodes have to sync up entities for an authority transfer/handoff when entities are about to cross from one Territory to the other.

The Replicant will update the data in its own in-memory cache with the data which was send from the server nodes (with authority) and persist these changes back to the EntityGraph database.

![Image](/images/dynamic_server_meshing/image-23.png)
