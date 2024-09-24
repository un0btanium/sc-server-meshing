### EntityGraph 4/4 - The Stow & Unstow Feature
The Global Database and Stowed Items are important in the context of Persistent Entity Streaming. Even though the goal is a single game world, a "Single Shard", until Server Meshing provides the performance for it, there will still exist multiple game worlds in parallel. Therefore, initially players have to be able to move between game worlds, determined by matchmaking, whenever players log-out and back in. In this case, the player items need to move with our player characters between game worlds. The Global Database enables this capability and makes our data accessible to all game worlds.

For this, the architecture now differentiates between stowed and unstowed items:

* When an item exist physicalized in a game world, it is an unstowed item and is stored in the EntityGraph database of that game world.
* When an item exists inside inventories or is a un/despawned ship - and therefore only interactable from the UI - then they are considered stowed items and are stored in the Global Database.

Therefore, whenever items are moved into an inventory, its EntityGraph node (e.g. Gun #9001 in the image) is removed from the EntityGraph database and a new entry is created into the Global Database (e.g. into the Inventory of Box #123). If an item is taken out of an inventory or a ship is spawned, then it is removed from the Global Database and a new node is created in the EntityGraph (an edge as well). All items stay unique.

![Image](/images/persistent_entity_streaming/image-10.png)
