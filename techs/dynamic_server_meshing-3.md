### Entity Zones - Dynamic Game World Splitting 1/2
As we have seen in Static Server Meshing, we are already able to split the game world using Entity Zones (see the images). However, these Zones would be assigned to game servers only at initial startup and setup of a shard and would stay fixed after that. This is one of the aspects that is going to be made dynamic now.

For Dynamic Server Meshing, an algorithm will monitor the load in the Entity Zones and game servers. If one gets overloaded (or underutilised), the algorithm can decide that the load should be distributed differently. It will then re-distributed the Zones across the game servers. This will happen seamlessly while we play.

As an example, lets assume there had been a lot of players at the spacestation in the top left of the level. But now, most of those players are moving over to a location near the top right of the right planet. Under Static Server Meshing, that might leave behind an underutilized red game server while the blue game server is going to be overloaded, maybe because it had a lot of players in one of its other locations already.

![Image](/images/dynamic_server_meshing/image-01.png)
![Image](/images/dynamic_server_meshing/image-02.png)
![Image](/images/dynamic_server_meshing/image-03.png)
