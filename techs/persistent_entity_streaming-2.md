### EntityGraph & Global Database & EntityGraph service
For persistence to work, the game data needs to be stored outside of the game servers. Databases are generally used for such a task, because data can be saved to them and later retrived/queried.

The game data of Star Citizen will be stored into two different database:

__EntityGraph database:__

* This is the successor to the pCache database which was introduce when SSOCS came online in Alpha 3.8.
* EntityGraph is a sharded, horizontally scalable graph database.
* It stores the entities which physically exist in the game world.
* Referred to as 'unstowed items'.
* This includes spawned ships, players, coffee cup, etc.
* Each game world has its own EntityGraph database to store its unique state of the game world independently from other game worlds.
* speculated: EntityGraph uses ArangoDB.
* A offline, in-memory version has been developed for the singleplayer game Squadron 42.

__Global Database:__

* The Global Database is the successor to the Long Term Persistence (LTP) database which was introduced shortly after SSOCS came online.
* It consists of three separate data collections:
* Stowed Items
* Wallet (aUEC)
* Reputation
* It stores the entities which are hidden away, only exist inside of inventories or are stored away (e.g. un-/despawned ships). Referred to as 'stowed items'.
* There only exists one Global Database for all game worlds (notice its name containing 'global').
* This allows ships and inventory contents to be accessible from every game world.
* Even if players change to another game world, their stuff will still be available in that game world as well.
