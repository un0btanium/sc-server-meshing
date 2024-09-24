### Entity Zones - Dynamic Game World Splitting 2/2
Under Dynamic Server Meshing, we can avoid overloaded and underutilized game servers by re-assigning Entity Zones to another game servers. In our case, it could decide that the red game servers is also going to simulate two Zones of the planet which were previously simulated by the blue game server. This way, the blue game server isnt overloaded and the red game server isnt underutilized.

To accomplish this, an (spatial partitioning) algorithm is going to monitor the load and decide, how the Zones are split and distributed among the game servers. The game servers might be given a period in which they load the other Zones before authority over the Zones are assigned, adding some complexity to the implementation. A special protocol might handle this.

__Note:__ If more players were to join the shard and all game servers are already under optimal load, then the shard might spin up a fourth game server (e.g. a yellow one) and the game world could once again be split up accordingly. Likewise, if players leave the shard, then game servers could be shutdown. But this dynamic functionality of starting and stopping game servers is likely going to be its own separate feature of DSM.

![Image](/images/dynamic_server_meshing/image-04.png)
![Image](/images/dynamic_server_meshing/image-05.png)
![Image](/images/dynamic_server_meshing/image-06.png)
