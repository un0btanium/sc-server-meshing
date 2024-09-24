# Physicalized Items and Inventory
### Overview
With the cache in the Replication Layer we have a centralized place to store all entity data and with Global Persistence the game servers are able to utilize that data.

__Challenges:__

* items are still very simple in their design and how the player can interact with them
* character inventories are still very simple in their design because they are merely global account inventories

__Solution:__ Physicalized Items and Inventory, first version came online with Alpha 3.15

__Requirement for:__ Persistent Streaming, Static Server Meshing

__Goals:__

* have items and inventories be physical objects in the game which take up space
* have items physically present in inventories when you open them (e.g. cargo boxes)

__Approach:__

* items will be a physical, interactive object in the game
* that even includes stuff like character clothes (with the Cloth Simulation implementation)
* even inventories are going to be physical items in the world, e.g. backpacks and cargo containers which can be put on the ground, moved around and picked up again (utilizing the Grabby Hands implementation)
* allow items to have child items
* allows the player to put items into other items, e.g. a battery into an electronic device (with Item Ports)
* allows hierarchies of nested items (bullets -> magazine -> gun -> backpack -> player)
