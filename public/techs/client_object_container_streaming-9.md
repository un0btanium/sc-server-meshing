### Client OCS in-depth 3/5
Once the player client receives the network packet, it will use the ID to look up the Object Container its own list of Object Containers. In this case, it will find the player character object. This Object Container acts as a blueprint to spawn new player characters from. So all player characters are spawned from the same Object Container.

However, not all players are the same, for example the player wears have different armor and holds a coffe cup. So the server might already sends additional information and more Object Container IDs within the same network packet already.

Even tho the blue player character is now loaded, the character might not be shown and simulated in the game world yet. For now, it just resides somewhere in memory on the red client's computer.

Of course, in our example, this same process is also happening for the client of the blue player. It needs to load the red player into its memory and is notified in the same way. However, we don't show the blue client in the example.

![Image](/images/client_object_container_streaming/image-07.png)
