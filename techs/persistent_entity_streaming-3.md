### EntityGraph 1/4 - Graph database
EntityGraph is a graph database and is the successor and replacement for the pCache, introduced with Server OCS.

Inside the graph database, game objects are represented as 'nodes'. Connections are made between nodes to symbolize a relation, also called 'edges' in the graph. A ship would be a node and all entities inside - like players and any entities the ship consists of - would also be nodes and be connected to the ship via an edge. The two main strengths of a graph database is that each edge can further describe the relation between two nodes. It also allows for arbitrarily complex queries.

This works perfectly with how Object Containers, Entity Aggregates, Entity Hierarchies and the ZoneSystem create a tree data structure, as well as how this information has to be read and written. While entities are moving around in the game world or interacting with one another, edges between nodes can easily be added and removed as well. This happens when entities move from one zone into another or entities detach/attach to each other. Adding, updating and removing nodes and edges are cheap database operations, which make up the majority of performed actions while simulating the game.

When a new entity is spawned, a new node containing the state of the entity is easily added into the graph. This may also happen when items are taken out of inventories.

![Image](/images/persistent_entity_streaming/image-01.png)
![Image](/images/persistent_entity_streaming/image-02.png)
