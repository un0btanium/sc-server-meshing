### Client OCS in-depth 1/5
So how does the client load objects?

Afterall, the client cant simply use a level save file anymore to load entities, since now those initially only exists in the game server's memory. The client only has a small section of the game world loaded, and everything that isn't loaded is therefore unknown to the client. Thus, it has to be the game server that has to let the client know which objects to load.

In our case, the red player client does not know about the blue player yet, because the blue player is on the other side of the level and too far away still. But, the blue player is traveling toward the red player's position. So lets see how this plays out.

![Image](/images/client_object_container_streaming/image-05.png)
