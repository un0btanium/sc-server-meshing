# pCache
### Overview
__Challenges:__

* Before Server OCS, all entities are stored in the game engine memory. However, for persistence to come online, if the game server goes down, then all data in memory will be lost. Not ideal, for a game that aims to have a persistent game world where everything has to keep existing, even between game server reboots.
* Looking at the requirements under Server Meshing, multiple game servers will need to access the same game world data, and therefore this data needs to be made accessible to all game servers in a centralized place
* However, for now there only needs to be a prototype database backend put in place to bring the first version of Server OCS online and to figure out which requirements Full Persistence has.

__Solution:__ Persistent Item DB & pCache,

__Requirement for:__ Server OCS

__Goals:__

* Bring the first version of Server OCS online by creating a prototype a first prototype backend for persistence

__Approach:__

* Create the prototype persistence backend for Server OCS, using an in-memory database cache called pCache, which (speculated) connects the data to an on-drive database called Persistent Item DB.
* While running, the game server can now offload entities into the cache and database and load it again depending on where players are in the game world. This uses the SOCS functionality.
* This prototype solution used a relational database.
* This prototype was planned to be replaced by a proper and scalable database that would sit outside the game server. This was initially supposed to be iCache. However, the initial R&D continued working out a scalable solution using a relational database, but at the end of 2020 this turned out that it didnt provide the low latency and performance CIG were looking for. Starting 2021, they switched to a graph database instead, which showed results internally for the first time in Mai 2022, expected to come online with PES in the Alpha 3.18 patch.
