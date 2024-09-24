### Client OCS in-depth 4/5
Once the blue player moves even closer to the red player, the server notices this again. This time it sends the entire entity state of the blue player as a so called Entity Snapshot to the client.

When the red client receives it, it is used to properly position and initialize the player character. At this point, both server and client have synced up the blue character, as both have the same state in memory.

__Note:__ The player client loads and receives state updates prior to when they would start moving into actual view on screen.

![Image](/images/client_object_container_streaming/image-08.png)
