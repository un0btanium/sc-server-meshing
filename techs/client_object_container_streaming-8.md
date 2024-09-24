### Client OCS in-depth 2/5
Once an object moves close enough to a player, the server notices this and considers it relevant for that specific player client. Again, this also takes into account the size of the object, not just the distance to the player. Once identified, the server makes use of Object Containers to communicate it to the client.

Both the client and the server have the same list of Object Containers and each Object Container has the same identifier. In our example, player characters have the id #001. This allows the server to sends a network packet to our red client, which contains the Object Container ID #001.

This reduces the network bandwidth required while playing the game. Sending only the identifier of an Object Container means that the server does not have to send the actual Object Container itself nor any resources associated with the Object Container. Resources like textures, geometry, sounds, etc. are all downloaded onto the player's drive while downloading and patching the game. That is also the time when the list of Object Containers is downloaded.

![Image](/images/client_object_container_streaming/image-06.png)
