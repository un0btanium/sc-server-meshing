# Server Nodes
### Challenges:
* Because the backend architecture is getting more complex once moving toward Server Meshing, there needs to be new terminology.
* A single Game Server won't simulate the entire game world once Server Meshing comes online.

__Solution:__ Server Nodes (sometimes still DGS, Dedicated Game Server, or simply still game server)

__Requirement for:__ Server Meshing

__Goals:__

* Game Servers become a horizontally scalable service, meaning multiple game servers can run alongside each other, simulating the same game world (Shard)
* Server Nodes do not perform Replication (and persisting into a local in-memory database) anymore, as this is moved out of the game server and into the Replication Layer (see topic)

__Approach:__

* Server Nodes are still Game Servers (DGS). As before, they are responsible for simulating the game world, verifying the actions of the players and simulating AI. The difference is that now a specific Server Node might only a part of the game world, and not the entire game world anymore.
* There can be many server nodes computing the same game world. The term server 'node' highlights that it is one of many game servers in a much larger network and those nodes having been setup to work within it.
* To determine which Server Node is computing which part of the game world, a Server Node will be assigned authority (from Atlas) over the entities in that section of the game world. The code logic known as Entity Authority will then perform the correct action on the server, depending on if that server has authority or not (or is about to gain/lose authority when authority is transferred and entities are simulated by another server node afterwards).
