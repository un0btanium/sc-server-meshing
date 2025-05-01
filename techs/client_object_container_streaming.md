# Client Object Container Streaming

![Image](/images/milestones/milestone-02.png)

### Overview
With Object Containers it is now possible to split a level into separate game areas and load them into a level anytime. However, that functionality cant be utilized yet. Client Object Container Streaming (sometimes Client Side OCS or CSOCS or COCS) sets out to change that.

__Challenges:__

* by increasing the amount of objects in the level, more and more system memory is required
* by adding more entities into the level, the load on the CPU for entity computation each game tick increases
* the CPU of the client has to keep entities in sync with the server by updating its state
* too many entities computed currently results in not enough CPU load available to help render the game
* frame rate and performance on the client drops

__Solution:__ Client Object Container Streaming, an intermediate step toward complete Object Container Streaming, also sometimes more generally known as (Area of) Interest Management

__Goals:__

* reduce the memory requirements on the player client
* reduce the load on the CPU on the player client
* allow for more objects and entities to be added into the level on the server (e.g. more planets, locations and players)

__Approach:__

* reduce memory usage by only loading the nearby/visible objects of the level around the player
* dynamically stream Object Containers in and out of the level while the player is traveling across the level or entities (like other players and their ships) approaching/leaving the player
* the server notifies the player clients whenever the player clients should load objects
* streaming entities in and out reduces the amount of entities that have to be computed by the client CPU
* for far away entities, the server stops/skips network updates based on the entity's distance to the player to save client CPU usage (such features are generally called Interest Management, limiting the necessary information sent/simulated by that what interests the client)

### Initial Situation
Without Client Object Container Streaming, all clients and the server have the entire level loaded. This means that all object have to be loaded from drive into memory on level start or when connecting to the server. The server CPU computes all objects/entities and sends state updates to the clients via messages over the network/internet. This leads to CPU usage on the player client being quite high because it receives information about all objects in the level as well as the CPU having to help prepare the next frame to be rendered as well.

The client is overloaded with too much information and the CPU cant help render the game as much anymore and even the frame rate starts to suffer. The server does not have that additional load since no graphics are being rendered on it, only the entities updated on each game tick.

In the picture on the left, at the top, we can see that the entire level is loaded (white area is loaded). CPU (blue) and memory usage (orange) are quite high since all entities are loaded from drive into memory and being computed on the CPU.

![Image](/images/client_object_container_streaming/image-01.png)

### The Solution 1/2
With Client Object Container Streaming, clients do not have to load the entire level anymore, only the nearby objects around them. This may be another player standing right in front of the player, the enemy space ship the player is shooting at, the space station in orbit, or the moon far away in the sky. Which objects are being loaded is determined by how far away and how large the object is, so that the moon in the sky will be computed and displayed but not the small players which are on that far away moon.

In the picture on the left, we now see that for each player client only the area around that player is loaded. The remaining level is not loaded which is represented with the greyed out areas. We also see the expected reduction in memory usage (orange) and the load on the CPU (blue) since we have to load less data into memory and need to update less entities on each game tick.

__(Note:__ All percentages are purely for visualization, not real world performance statistics!)

![Image](/images/client_object_container_streaming/image-02.png)

### The Solution 2/2
When a player moves around in the level, object containers behind/far away from the player can be being unloaded while object containers that are about to come 'into view in front' of the player are being loaded into memory (e.g other players, ships and items) (Note: "view" refers to objects all around the player, not just the objects directly in front where the player is currently looking at, since the players view can change rapidly, faster than data can be loaded from drive into RAM.) This requires communication between the client and the server where the server notifies the client to load objects via Object Container into memory.

In the example on the left, the blue player (Client A) moved around in the level toward the red player. As the red player came into view, he was loaded into memory on the blue players computer and started receiving updates from the server to stay in sync. The same for the red player who loaded the blue player into memory and started computing him each tick.

![Image](/images/client_object_container_streaming/image-03.png)

### Multiple systems working together
Since the client does not need to know about all entities that are on the server anymore, Client OCS and its functionality was initially referred to under the name Network Bind Culling (or Network LOD). Essentially the data on the client is culled via the network by the server. However, it seems as if Network Bind Culling is just one part of many that brought us the final Client OCS functionality. Here is a quick summary:

__Serialized Variables:__ Introduce network update policies to entities and their variables, e.g. a variable being constantly networked on each game tick or only when its state changed to reduce and optimize network bandwidth.

Entity Component Update Scheduler: Provides information of how far away an object is to the player. It supported the functionality of starting and stopping (essentially skipping) network updates of entities that are too far away from *all* players.

__Serialized Variable Culling:__ The Entity Component Update Scheduler stopped networking entities to the clients that were too far away from all players, but all clients still were send network updates of all entities around ALL players on that server, no matter how far apart the players were from each other. Serialized Variable Culling changed that: The server now only sends each client the updates of entities which are near that specific player, not all players anymore.

__Network Bind Culling:__ The previous features were only about limiting network updates, all entities were still loaded on the client even if they did not receive network updates anymore. This was changed with Network Bind Culling. This feature added the functionality for the server to tell the client when to load objects on each client from/into memory. This makes use of the Object Containers.

With Client OCS, a player client is able to load and stay in sync with the entities on the server which are relevant to that specific client. Therefore, information on the client has been reduced, selected based on the object size and distance to the player in the level. More features, like loading these objects into memory in the background in other CPU threads as well as the Serialized Variables feature for efficient networking, accumulated in the final Client OCS feature.


### The streaming bubble
The bubble doesnt actually exist as such. We are just using it to visualize more easily that stuff is loaded around the player. But in reality, whats loaded are the individual game objects.

(On a similar note, the actual (empty) space of a level doesnt need to be loaded, as 'nothingness' does not have to be represented as a game object in memory).

But we might think of the bubble as the spatial query which determines which game objects to load. This makes use of the 3D 64bit geohash "StarHash" and a Radix Tree which are suited to perform such spatial queries. It factors in the distance between each game object and player, as well as the size of each object.

Therefore far away and/or small objects might not be loaded because those wouldnt be visible to the player anytime soon. Likewise, objects that are really large - like moons or planets -might still be loaded from far away. With Object Containers being nested, not all contents of a location need to be loaded all at once either. While the planet ArcCorp might be loaded already, the Area 18 city or parts of its interior might not be loaded yet as it is still too small. In a similar fashion, these small objects are unloaded first as well when a player departs and moves away from such location.

![Image](/images/client_object_container_streaming/image-04.png)

### Client OCS in-depth 1/5
So how does the client load objects?

Afterall, the client cant simply use a level save file anymore to load entities, since now those initially only exists in the game server's memory. The client only has a small section of the game world loaded, and everything that isn't loaded is therefore unknown to the client. Thus, it has to be the game server that has to let the client know which objects to load.

In our case, the red player client does not know about the blue player yet, because the blue player is on the other side of the level and too far away still. But, the blue player is traveling toward the red player's position. So lets see how this plays out.

![Image](/images/client_object_container_streaming/image-05.png)

### Client OCS in-depth 2/5
Once an object moves close enough to a player, the server notices this and considers it relevant for that specific player client. Again, this also takes into account the size of the object, not just the distance to the player. Once identified, the server makes use of Object Containers to communicate it to the client.

Both the client and the server have the same list of Object Containers and each Object Container has the same identifier. In our example, player characters have the id #001. This allows the server to sends a network packet to our red client, which contains the Object Container ID #001.

This reduces the network bandwidth required while playing the game. Sending only the identifier of an Object Container means that the server does not have to send the actual Object Container itself nor any resources associated with the Object Container. Resources like textures, geometry, sounds, etc. are all downloaded onto the player's drive while downloading and patching the game. That is also the time when the list of Object Containers is downloaded.

![Image](/images/client_object_container_streaming/image-06.png)

### Client OCS in-depth 3/5
Once the player client receives the network packet, it will use the ID to look up the Object Container its own list of Object Containers. In this case, it will find the player character object. This Object Container acts as a blueprint to spawn new player characters from. So all player characters are spawned from the same Object Container.

However, not all players are the same, for example the player wears have different armor and holds a coffe cup. So the server might already sends additional information and more Object Container IDs within the same network packet already.

Even tho the blue player character is now loaded, the character might not be shown and simulated in the game world yet. For now, it just resides somewhere in memory on the red client's computer.

Of course, in our example, this same process is also happening for the client of the blue player. It needs to load the red player into its memory and is notified in the same way. However, we don't show the blue client in the example.

![Image](/images/client_object_container_streaming/image-07.png)

### Client OCS in-depth 4/5
Once the blue player moves even closer to the red player, the server notices this again. This time it sends the entire entity state of the blue player as a so called Entity Snapshot to the client.

When the red client receives it, it is used to properly position and initialize the player character. At this point, both server and client have synced up the blue character, as both have the same state in memory.

__Note:__ The player client loads and receives state updates prior to when they would start moving into actual view on screen.

![Image](/images/client_object_container_streaming/image-08.png)

### Client OCS in-depth 5/5
Since the Entity Snapshot syncs up the entity, the game server can send - on the next and subsequent game ticks - the entity state updates to the client, like it would have done in any traditional client-server architecture without OCS.

This continues until one of the player exits the game or moves far away again and the object becomes irrelevant. Then the server stops sending entity state updates to reduce the CPU load and bandwidth. The server decides when to stop and resume networking for each individual client based on the network policies (like distance, object size and other more situational rule sets).

Even if network updates were stopped once, entities can move in and out of 'networking distance' again multiple times. If the object didn't move too far away yet, then it might still reside in memory and doesn't have to be loaded again. A new Entity Snapshot is being send each time networking starts up again. But once an object is continuously networked the server only sends values which change based on the networking policies of the Serialized Variables software system.

![Image](/images/client_object_container_streaming/image-09.png)

### Summary
Client OCS now provides each client a partial view into the entire level on the server. The server has to lift the majority of the work by letting each client know which objects to load from its drive into memory so that the client CPU can start receiving the entity updates from the server and have entities stay in sync with the equivalent entity on the server. (Speculation: It is likely that the client itself decides when to unload objects from memory based on its available RAM capacity.) The server figures out when a client needs to load and receive state updates. Whenever that is the case, the server communicates that to the client. Therefore, Client OCS put some additional load onto the server, to allow for a significant computation reduction and performance on the client.

This technology allowed CIG to improve performance for players significantly, because the amount of entities that had to be computed on the client was drastically reduced, thus the computation time for each game tick reduced. That also left the CPU with more time to help render more frames. The addition of multi-threaded loading and unloading of entities also reduced a ton of freezes and stutters. Client OCS allowed more objects like planets and their locations to be added into the Stanton solar system level (and more solar systems in general) without putting more load onto the player client.

