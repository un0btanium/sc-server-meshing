# Stow & Unstow
### Overview
With physicalized items and inventories making its way into the game there needs to be a way to reliably persist and access such information, even if players switch between game instances/shards.

__Challenges:__

* Entities that physically exist in the game world (items) have to be be put into inventories (stowed) and later taken out again (unstowed)
* Both items and inventories need to be persisted. The physicalized items and physicalized inventories in the game world are going to be persisted in the EntityGraph database. However, the non-physicalized items inside of inventories are not persisted into the EntityGraph and into the Global Database instead.
* That is because items in inventories need to be accessible across Shards in Server Meshing, but EntityGraph only groups data per-Shard.

__Solution:__ Stow & Unstow, communication between the EntityGraph and Global Database

__Requirement for:__ Personal Inventories, Persistent Entity Streaming, Static Server Meshing

__Approach:__

* When items are stowed into inventories, they stop existing as physicalized items in the game world and instead as an entry inside the inventory. The contents of inventories are then persisted into the Global Database (LTP), instead of the EntityGraph database.
* This allows players to access inventories content (like local and personal inventories), even if they switch to another game instance (or another shard under Server Meshing), since the Global Database stores Shard-independent data.
* Items can be easily moved between inventories. In the database this would be unstowed from the first inventory and directly stowed into the second inventory (most likely a single database transaction).
* Ships - and all items inside - can also be stowed into the Global Database when the ship is stored (e.g. by the player via a terminal) and later spawned/unstowed again
* this allowed for the first introduction of a rudimentary Ship Recovery in the case of a Server Crash (see Global Persistence/LTP for more info).
* Besides stow and unstow, there are even more DB commands, some of which are create, possess, transfer, stack, unstack, change location, change snapshot and bury.
