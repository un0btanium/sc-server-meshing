# EntityGraph
For the state of the game world universe to be persisted within a meshed server environment, all entity data needs to be stored in such away that they become accessible to all game servers in a responsive, low-latency manner.

__Challenges:__

* With each game server accessing its own in-memory pCache database, actual persistence of dynamic entities is barely existent.
* The current pCache database does not support the functionality for full persistence yet, e.g. items which are just laying around on the ground, as well as this information needing to be accessed from multiple game servers under Server Meshing.
* The first database used internally was a relational one, but this was not performant and low-latency enough (This was iCache/Item Cache).

__Solution:__ EntityGraph, a NoSQL graph-based database and scalable query services for persisting and retriving entity state

__Requirement for:__ Persistence, PES, Physicalized Items and Inventory, Server Meshing

__Goals:__ Use a horizontally scalable and shardable database and create a scalable service layer that can persists all entities in the game world and serve all game servers in a performant and thus responsive way (and allow for full crash recovery down the line)

__Approach:__

* This is the successor/replacement of the initially planned and internally implemented and tested, but unperformant iCache implementation.
* Create a horizontally scalable fleet of services and use a graph database (both together or on their own referred to as "EntityGraph") which persist entity data and allow requests to be send from other servers, translate those into a DB query, retrieve and transform the response data:
* Improves the response times for backend database requests.
* Uses best practices for fault tolerance and recovery via data replication and automatic regeneration in case a database instance crashes.
* This should also help reduce the load on each individual database instance, as data can be replicated/sharded onto separate DB instances.
* The database instances and the services in front of the database can be scaled freely, independent of game servers and shards.
* EntityGraph is a graph database: the entities in the game world form a large hierarchy which can be represented as a graph data structure:
* Each entity/game object in the game world is represented as nodes in the database, while relationships between entities are edges.
* Changing state of individual entities as well as changing relationships by adding or deleting edges are both cheap/fast operations in a graph database.
* Allows entities to be queried based on shard, star system, xyz position, object size and distance to players, entity type and custom labels.
* While playing, entities can form Entity-Aggregates which are streamed-in together. They can also be given a label which allow queries to request specific types of entities to be returned.
* With full persistence every entity anywhere in the level can be persisted, not just in pre-determined places such as weapon racks.
* Speculated: EntityGraph databases uses ArangoDB.
* Introduces Characters Repairs (instead of Character/Account Resets) as well as Entity Lifetime for Item Cleanup logic.
