# Entity Ownership Hierarchy / Entity Aggregates
### Overview
At level design time, Object Containers can be nested to create larger game areas out of smaller objects. However, there needs to be additional logic at runtime. Some entities are made up of smaller entities. And how these are made up can change while playing.

__Challenges:__

* These entity groups need to be represented in memory.
* These groups and hierarchies can cause issue when these objects are not loaded/unloaded in the correct order.

__Solution:__ Entity Ownership Hierarchy / Entity Aggregates (released in Alpha 3.0) (speculated: scene graph)

__Requirement for:__ Entity Spawn Batches & Entity Snapshots, Client Object Container Streaming

__Goals:__

* It is required to keep track when those dynamic groups are formed or disbanded.
* Load and unload groups of entities in the correct order (e.g. the ship exterior needs to be loaded before the ship interior, as the inner ship's state partially defined by the outer ship)

__Approach:__

* A group of entities - which are related to each other and form a larger entity - are called an Entity Aggregate (or Entity Root or Logical Entity). Examples:
* A weapon is the entity root and its attachments are entities attached to the weapon.
* A player character (entity root) picks up an item and holds it in its hand and moves around with the player.
* Entities can move in and out of each other, like ships and vehicles moving into other ships (speculated: therefore, this might be related to the zone system)
* How entities are related to each other is kept track in an Entity Ownership Hierarchy.
* Together with the Entity Component Update Scheduler, the server decides which Entity Aggregate(s) to load and unload on each client (by sending the equivalent Object Containers and Entity Snapshot updates).
* In the EntityGraph database, entities that are Entity Roots are labeled as such on the node (for queries).
