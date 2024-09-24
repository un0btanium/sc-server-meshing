### Example - Initial Situation
With the implementation of Client OCS, we have reduced the memory and CPU load for the clients. However, the server still has to have all areas loaded into memory and all entities in those areas (like NPCs and players) computed each game tick, whether there are players in that area or not. That uses valuable memory and CPU computation time. This prevented the addition of new planets and locations since the server would exceed its memory capacity and CPU load.

The idea to solve this is simple: Implement the same Object Container Streaming functionality for the server as well. That means: Only load those areas with players and unload all areas with no players.

The difficulty here is, that the server defines the "ground truth", the universal state, for all the clients. Therefore, the server has to make sure that it has loaded all objects around players itself first, before being able to load and communicate state changes of those objects on/to the clients.

![Image](/images/server_object_container_streaming/image-01.png)
