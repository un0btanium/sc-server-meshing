### Example - The Solution
With Server OCS being implemented, the server too now only loads the areas with players in them. When players move around the level, the server dynamically loads the level in front of the player and unloads the level behind the player (if there are no other players in that area already/anymore, that is). CPU and memory loads are now reduced on the server, allowing more objects to be added into the level again. The server sends periodic queries to a database to check if objects around players are about to come into view. If that is the case the server will lookup the Object Container identifier of those objects and load the object into its memory.

This technology allowed CIG to add more planets and moons of the Stanton system into the level which was previously impossible without exceeding the server resources.

Unfortunately, Server OCS did not increase the player count of servers. Most computation intensive areas (like landing zones) were always populated by players and thus are usually never unloaded. Load was still high on the servers. Therefore, CIG had to decide between more players or more content. They went with more content.

![Image](/images/server_object_container_streaming/image-02.png)
