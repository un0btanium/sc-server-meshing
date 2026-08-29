# Instancing
### Overview

__Solution:__ Instancing

__Goals:__

* introducing instancing of areas to the MMO

__Approach:__

* First introduced with instanced hangars in Alpha 3.24.
  * "Introduction of new tech that creates an instance of the player's hangar to allow for uninterrupted management of cargo, inventory, and vehicles. Personal hangars are found at the player's home location and allow for customization and organization of the hangar interior."
  * "All hangar types are instanced, meaning they are able to physically stack on each other in the same location without interference. All hangar types have ASOP terminals, Item Banks, and Freight Elevators (SCU fright amount depends on hangar size). All hangar types have ship elevator platforms which will lower when players request a ship to be spawned. Any ships already on the platform will be lowered and then stored via asop. All hangar types should be accessible to party members of the Hangar owner."
  * "Any items, decorations, and vehicles left inside the Hangar should persist as well as recover their state and move to new shards after a crash recovery, though objects will be cleaned up if left on the ship loading elevator."
* In a later version (Alpha 4.10) this was extended to allow instances to be created on separate game servers.
  * first introduced in Alpha 4.10 with Siege of Orison being reworked as a 4 player squad instanced experience.
  * these instances can be PvE (Siege of Orison) or PvP (e.g. Contested Zones) (or likely even something inbetween PvPvE)
  * an Instance Manager was introduced