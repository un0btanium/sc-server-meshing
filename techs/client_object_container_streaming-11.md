### Client OCS in-depth 5/5
Since the Entity Snapshot syncs up the entity, the game server can send - on the next and subsequent game ticks - the entity state updates to the client, like it would have done in any traditional client-server architecture without OCS.

This continues until one of the player exits the game or moves far away again and the object becomes irrelevant. Then the server stops sending entity state updates to reduce the CPU load and bandwidth. The server decides when to stop and resume networking for each individual client based on the network policies (like distance, object size and other more situational rule sets).

Even if network updates were stopped once, entities can move in and out of 'networking distance' again multiple times. If the object didn't move too far away yet, then it might still reside in memory and doesn't have to be loaded again. A new Entity Snapshot is being send each time networking starts up again. But once an object is continuously networked the server only sends values which change based on the networking policies of the Serialized Variables software system.

![Image](/images/client_object_container_streaming/image-09.png)
