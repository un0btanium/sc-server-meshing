### Entity Authority & Authority Transfers 7/8
The Blue player continues their journey, now simulated by the second game server. Server OCS continues to load and unload the game world accordingly on both game servers. However, the decision making (what needs to be loaded) is not done by the game servers individually anymore and instead the Hybrid service figures out which Object Containers have to be loaded on which game server (and clients as well for Client OCS).

For this, the Hybrid services/Replication Layer makes requests to the EntityGraph database and loads the game world - around the players - into its own memory/cache. That is why we can think of the level shown on the left in our example as the Hybrid service. However, the Hybrid service does not simulate anything. That is the responsibility of the game servers. But we can think of the Hybrid service as having client views of all entities on the game servers.

![Image](/images/static_server_meshing/image-14.png)
