# Global Database
### Overview
So far, every three months on each major patch the player progress is completely wiped because the database was reset.

__Challenges:__

* players dont have a lot of incentive to work toward ships and other items (especially ever since in-game ship purchases and rentals came available) because they will be removed again every three months

__Solution:__ Long Term Persistence (LTP, Platform Persistence, "Baby Persistence"), later reworked and renamed to 'Global Database'

__Goals:__

* Implement a first version of persistence for player account data.
* (note: this feature is not Full Persistence because Full persistence is about saving data of the game world which is what PES and the EntityGraph database is going to do)

__Approach:__

* The first version released in Alpha 3.8.2 with:
* aUEC balance
* Ship purchases and rents
* Ship component purchases
* FPS item purchases
* This allowed the introduction of the currency trading app (mo.TRADER) in Alpha 3.10.0 by utilizing the database that stores the information about the players aUEC balance.
* This database now saves in-game purchases of ships to allow players to work toward and keep their ships across multiple patches.
* "As of [Alpha] 3.15, Long Term Persistence is broken up into three distinct parts: Items, Wallet (aUEC), and Reputation. Going forward, we will be able to wipe specific parts of LTP individually as needed (for example, wiping Reputation while leaving Wallet and Items intact). This level of flexibility will allow us to do necessary wipes while minimizing the impact on the community."
* The Item part of the database is most likely the Global Database holding inventory items of a player across shards.
* Alpha 3.15 also came with an interim implementation for Server Crash Recovery specifically for ships. This was done by checking the Replication Layer cache (containing a snapshot of the physicalized ship entity of the crashed server) for all player ships. Those ships are then stowed into the Global Database (LTP). From there, it then can be spawned again on any server at a ship terminal. The interior (including cargo) is spawned and available as well. This was a first workaround before the actual server crash recovery that will allow us to keep playing exactly where the game left us of (e.g. inside our ship while Quantum Travelling).
* Alpha 3.18 introduced multiple quality of life improvement, one of which being stacking of similar items and a "tranfers all" button.
