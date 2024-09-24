### The Solution 2/2
When a player moves around in the level, object containers behind/far away from the player can be being unloaded while object containers that are about to come 'into view in front' of the player are being loaded into memory (e.g other players, ships and items) (Note: "view" refers to objects all around the player, not just the objects directly in front where the player is currently looking at, since the players view can change rapidly, faster than data can be loaded from drive into RAM.) This requires communication between the client and the server where the server notifies the client to load objects via Object Container into memory.

In the example on the left, the blue player (Client A) moved around in the level toward the red player. As the red player came into view, he was loaded into memory on the blue players computer and started receiving updates from the server to stay in sync. The same for the red player who loaded the blue player into memory and started computing him each tick.

![Image](/images/client_object_container_streaming/image-03.png)
