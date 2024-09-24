# Replication Layer & Replicant Services
Replicant is one of the components of the initial Replication Layer/Hybrid Service but will be its own scalable service later on.

__Challenges:__

* communication between clients and servers has to be scaled up to support more of both in the same shard

__Solution:__ Replicant component, Replication Layer with horizontally scalable Replicant Services

__Requirement for:__ Persistent Entity Streaming, Server Meshing

__Goals:__

* make the streaming and networking logic scalable for more clients and servers
* have clients/servers partially look into multiple game servers in a performant way
* allow for server recovery and client reconnects feature
* provide a cache for entity state from the EntityGraph database for the clients and server nodes

__Approach:__

* Parts of the entity networking and OCS logic of the game server is being moved into their own service called the Replicant.
* The servers nodes and player clients don't connect and communicate directly anymore, but instead via the Replicant service (as well as the Gateway service).
* The Replicant will be turned into a horizontally scalable service as well, where each Replicant (with its server nodes) handles a different section of the level. Together, they will form the Replication Layer.
* The Replicant includes partial logic of the Entity Component Update Scheduler (ECUS), as well as - speculated/deduced - the StarHash (Starhash Bind Culling) logic of the Entity Streaming Manager, Network Bind Culling and Serialized Variable Culling. Together, they will:
* Manage loading of Object Containers for both client and server (Network Bind Culling, Entity Streaming Manager, StarHash Bind Culling)
* Replication of networked entity state between clients and server nodes (ECUS, Serialized Variable Culling, StarHash Bind Culling)
* As well as persisting entity state changes into the EntityGraph database (Persistence, Persistent Streaming)
* Note: the Replicant does not run code related to game logic, like simulation or physics (as that is the job of the server nodes).
* This allows for the following new functionality:
* Now, game servers won't have to figure out which Object Containers have to be loaded/streamed on both the game server and clients anymore. Instead, the Replicant will figure this out and inform the server nodes and clients instead (and both can load the same entities in parallel which also allows server and clients to have different streaming bubble sizes).
* The server nodes are able to directly send their network updates to the Replicant service once, which then determines which entity states should be send to which client(s) (and maybe other server nodes in the shard) that need it. This would make the Replicant be a mediator and sit between the server nodes, clients and databases.
* The Replicant operates event-driven (not tickrate-driven like game servers), meaning that it directly processes network updates when they are received.
* Additionally, each Replicant contains a cache (in-memory database, iCache) in which parts of the data from the EntityGraph database are copied into. This allows quicker read and write access to entity state data. The Replicant persists its entity state back in the EntityGraph database, so that not a lot of data will be lost in the case if a Replicant crash.
* The Replicant component may have come online in Alpha 3.17 as part of the Replication Layer already.
* The Replicant service will be released once the Hybrid service is broken up (see Replication Layer V2).
