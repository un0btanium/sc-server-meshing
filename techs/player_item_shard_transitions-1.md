# Player Item Shard Transitions
### Overview
__Challenges:__

* Because there will be a large time frame in which we still have multiple game worlds running alongside each other, the multiverse, (because Shards cant be scaled up high enough to support single regional Shards or even a single world-wide Shard), there is a need for players and their items to move between Shards.

__Solution:__ Player Item Shard Transitions

__Requirement for:__ Persistence

__Goals:__

* be able to move game objects in the game world between Shards when the player switches the Shard

__Approach:__

* "With the introduction of fully persistent shards, items/ships that are left “in the open space” are bound to that shard until a player collects them and stores them into an inventory or parks a ship at a landing location. In order to provide a more frictionless experience we will implement a feature that automatically stores these ‘freely placed’ items from the shard when areas are streamed out, and places them into a different shard when the player logs into a new shard. This allows players to find their freely placed ships/items that are left in the open space regardless of which shard instance they are assigned during login." - Roadmap Deliverable
* Data in the Global database (stowed items) does not have to be transfered like this as it is already Shard-independent (meaning, it is available to all shards). This moving data between GlobalDB and EntityGraph is a different functionality (Stow & Unstow) which has come online with Alpha 3.18, but has nothing to do with Player Item Shard Transitions.
* CIG has talked about ideas on how to handle land claims and bases under the multiverse; They would exist across all game worlds, but in an inactive state except in the shard in which the owner plays on.
