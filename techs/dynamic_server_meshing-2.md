### Features of Dynamic Server Meshing
The Dynamic Server Meshing (DSM) feature itself can be thought of as multiple sub-features and iterations.

* Dynamic Server Meshing V1 ("Dynamic Entity Zones"): The Entity Authority of Entity Zones can be passed between game servers automatically, to distribute the load optimally between the game servers of a Shard.
* Dynamic Server Meshing V2 ("Dynamic Entity Zone Splitting"): If the load is too high, a single Entity Zone can be further subdivided into "Simulation Islands", which can then be simulated by different game servers again. (Depends on DSM V1)
* Dynamic Starting & Stopping of Game Servers: Adding and removing game servers from a Shard, based on the load within, allows the renting cost of game servers to be reduced to an optimal minimum.
* Splitup of the Hybrid Service components/Replication Layer V2: Once DSM is working, the Hybrid service will become the bottleneck. Therefore, the individual components inside the Hybrid Service will be moved out and onto their own servers, to handle more load. The Hybrid Service will become obselete. (Depends on DSM V1)
* Dynamic Scaling of the Replication Layer V2: Instead of just one service per type, more services can be added (and removed again) so that multiple service run simultaniously and handle more load. This allows Shards to scale higher. (Depends on Replication Layer V2)

Some of these features have to come online before others do, so it is likely that not all of these features come online all at once, and instead get rolled out over multiple patches.

