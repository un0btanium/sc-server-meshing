# Quasi-Dynamic Server Meshing
### Overview

__Solution:__ Quasi-Dynamic Server Meshing

__Goals:__

* Introduce Instancing for isolated, custom-tailored gameplay experiences
* Provide better performance by spawning these instances onto separate game servers
* dynamic startup and startup functionality of game servers and instances

__Approach:__

* Use the new Transport System and Instancing logic to implement Instancing tech that puts players onto separate game servers while still being physically in the same Shard.
* Introduce Instance Manager to keep track of instances and their lifetime.
* Already requires lots of dynamic functionality such as moving authority across different game servers on-demand and error-free.
* First introduced in Alpha 4.10 with Siege of Orison being reworked as a 4 player squad instanced experience.
* These instances can be PvE (Siege of Orison) or PvP (e.g. Contested Zones) (or likely even something inbetween PvPvE)