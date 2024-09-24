# Server Object Container Streaming
### Overview
With Client Object Container Streaming (COCS) we have improved the performance and memory requirements on the client side which improved the performance for the players noticeably. On the server, we can now increase the level size by adding more objects into the level, for example more areas like planets and locations without effecting the performance on the client as much as it did.

__Challenges:__

* the server still has to compute all entities and have all Object Containers loaded in memory
* while adding more objects into the level does not effect the player client as much anymore, the server still has to load all and compute most of them, no matter if players are nearby or not
* adding more and more objects into the level starts to exceed the server CPU and memory load which prevents us to create even larger levels with more content

__Solution:__ Server Object Container Streaming (sometimes Server Side OCS or SSOCS or SOCS), Interest Management for the game server

__Goals:__

* Reduce the memory requirements on the server.
* Reduce the load on the CPU on the server.
* This is going to help performance later under Server Meshing, where multiple servers will simulate a game world, but don't have to load the entire game world and instead only their little corner section of it.

__Approach:__

* Dynamically stream game objects in and out of the level on the server while players are moving around
* Serialize entities via Serialized Variables and stream/save/load entity data into and out of a database (pCache, later iCache) to free up memory, thus the server only has a portion of the entire database loaded
* Thus only load the level areas where players are nearby to reduce the memory consumption
* With certain areas of the level not loaded, the amount of entities that have to be computed on the CPU is being reduced and performance does not deteriorate on the server anymore
### Example - Initial Situation
With the implementation of Client OCS, we have reduced the memory and CPU load for the clients. However, the server still has to have all areas loaded into memory and all entities in those areas (like NPCs and players) computed each game tick, whether there are players in that area or not. That uses valuable memory and CPU computation time. This prevented the addition of new planets and locations since the server would exceed its memory capacity and CPU load.

The idea to solve this is simple: Implement the same Object Container Streaming functionality for the server as well. That means: Only load those areas with players and unload all areas with no players.

The difficulty here is, that the server defines the "ground truth", the universal state, for all the clients. Therefore, the server has to make sure that it has loaded all objects around players itself first, before being able to load and communicate state changes of those objects on/to the clients.

![Image](/images/server_object_container_streaming/image-01.png)
### Example - The Solution
With Server OCS being implemented, the server too now only loads the areas with players in them. When players move around the level, the server dynamically loads the level in front of the player and unloads the level behind the player (if there are no other players in that area already/anymore, that is). CPU and memory loads are now reduced on the server, allowing more objects to be added into the level again. The server sends periodic queries to a database to check if objects around players are about to come into view. If that is the case the server will lookup the Object Container identifier of those objects and load the object into its memory.

This technology allowed CIG to add more planets and moons of the Stanton system into the level which was previously impossible without exceeding the server resources.

Unfortunately, Server OCS did not increase the player count of servers. Most computation intensive areas (like landing zones) were always populated by players and thus are usually never unloaded. Load was still high on the servers. Therefore, CIG had to decide between more players or more content. They went with more content.

![Image](/images/server_object_container_streaming/image-02.png)
### Summary and Future Features 1/2
While Client OCS allowed clients to have a partial view into the level of the server, Server OCS now allows the server to have a partial view into the entire level. The entire level is now stored in a database on the server drive (and later into the large database at first pCache, then the new horizontally scalable EntityGraph).

The server now does not have to load the entire level anymore, only select parts of it. Thus, even if the level size increases into hundreds of GBs (or even terabytes) in the database, it only needs to load a couple GB of it into memory at all times.

Additionally, Server OCS will also be used for the Squadron 42 singleplayer game to load and unload objects on demand. A local database (EntityGraph) running on our computer along side the game, will act as the game save files by serializing the game objects from memory onto the drive and then loading it again from the drive into memory via Server OCS.

### Summary and Future Features 2/2
With the first version of Server OCS, whenever an area of a level is unloaded onto the drive/database, the entities in those areas wont be computed in the game loop anymore, thus no changes are occurring. Essentially, that specific section of the world is frozen in time until a player moves back into that area again. That is not ideal in a simulated, immersive and economy driven universe.

To solve this, in the future, another server/service will take those unloaded areas and quickly simulate the time that has passed. This way, the computation resources required are greatly reduced by abstracting the simulation to a minimum. The universe would still appear alive. For example, NPCs who are busy repairing a ship wont have to be simulated running around and doing their job if no player is around to witness them doing it, only the ship hull values have to be increased in the database in the background. When a player enters the area again, the ship will be in a more repaired state compared to when the player left the area. Meanwhile, the NPCs are loaded back into the area again as if they were busy the entire time, even thought they did not actually exist to work on repairing the ship. This way, the entire universe will always feel alive, even thought most of the universe won't even be actively loaded and computed on the game servers themselves. This feature heavily relies on Global Persistence to be completed, since values have to be update in the database, then accessed and loaded into memory by the game servers. Simulating the game world on a higher abstraction level is also going to be the main functionality of the StarSim Economy Simualtor.

Another major future feature of Server OCS relying on Full Persistence as well will be Server Recovery. Once all states of all entities are continuously persisted into a database it becomes possible to recover a server after a crash. If a crash happens, a new server can be started in its place, the database provides the information about the entities that were present on the server at the time of the crash, load those entities back into memory via Server OCS and connect the player clients back to the server again. Therefore, in case of a server crash, players would only have to experience a couple seconds of interruption and barely any loss of progress in the game before being able to continue playing the game again where they left off.

