# Global Persistence
### Overview
With the EntityGraph and Global Database, we are provided a centralized place for all game servers to access entity data.

__Challenges:__

* The game servers still access the data in the old pCache database, not the new EntityGraph one.
* The databases and how data is stored changed a lot so a new way of querying the data is required.

__Solution:__ Global Persistence, which makes Server OCS utilize the new cache/EntityGraph and Global Database, of which a first version came online with Alpha 3.15 to enable persistence.

__Requirement for:__ Physicalized and Persisted Items and Inventory, Replication Layer, Static Server Meshing, Squadron 42

__Goals:__

* Let the game servers utilize the entity and inventory data stored in the EntityGraph and Global Database (LTP).
* With the state of entities being persisted long-term, more gameplay that utilizes the functionality of items existing in the game world long-term in the game world will be implemented and introduced into the game.

__Approach:__

* Change/extend Server OCS with this new functionality.
* This is the interface between the game server and the database(s) (and services and caches in front of the databases).
* Initially developed for iCache, parts of its implementation was reused and adjusted to work with EntityGraph and the new PES architecture.
* Speculated: While players move through the game world, the Replication Layer asks an EntityGraph database, if there are any entities in the area around the player.
* Let the Replication Layers cache and the game server load those entities into memory via Server OCS and on the game server start simulating them in the game update loop by the CPU.
* When players leave an area, serialize and send the entity state to the EntityGraph database (or Global Database in terms of Inventories and ships) to have it be saved and persisted.
* Unload the entity from memory to make room for new ones which is already part of Server OCS capabilities.
* The Replication Layer might periodically persist the state of entities to prevent data loss on a server crash.
* This functionality will also be used by the singleplayer game Squadron 42 to access the local offline database.
