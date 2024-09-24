### Multiple systems working together
Since the client does not need to know about all entities that are on the server anymore, Client OCS and its functionality was initially referred to under the name Network Bind Culling (or Network LOD). Essentially the data on the client is culled via the network by the server. However, it seems as if Network Bind Culling is just one part of many that brought us the final Client OCS functionality. Here is a quick summary:

__Serialized Variables:__ Introduce network update policies to entities and their variables, e.g. a variable being constantly networked on each game tick or only when its state changed to reduce and optimize network bandwidth.

Entity Component Update Scheduler: Provides information of how far away an object is to the player. It supported the functionality of starting and stopping (essentially skipping) network updates of entities that are too far away from *all* players.

__Serialized Variable Culling:__ The Entity Component Update Scheduler stopped networking entities to the clients that were too far away from all players, but all clients still were send network updates of all entities around ALL players on that server, no matter how far apart the players were from each other. Serialized Variable Culling changed that: The server now only sends each client the updates of entities which are near that specific player, not all players anymore.

__Network Bind Culling:__ The previous features were only about limiting network updates, all entities were still loaded on the client even if they did not receive network updates anymore. This was changed with Network Bind Culling. This feature added the functionality for the server to tell the client when to load objects on each client from/into memory. This makes use of the Object Containers.

With Client OCS, a player client is able to load and stay in sync with the entities on the server which are relevant to that specific client. Therefore, information on the client has been reduced, selected based on the object size and distance to the player in the level. More features, like loading these objects into memory in the background in other CPU threads as well as the Serialized Variables feature for efficient networking, accumulated in the final Client OCS feature.

