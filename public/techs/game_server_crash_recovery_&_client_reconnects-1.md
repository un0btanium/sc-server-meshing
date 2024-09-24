# Game Server Crash Recovery & Client Reconnects
### Overview
EntityGraph and the Replication Layer will allow for the recovery of crashed servers and reconnets of disconnected players.

__Challenges:__

* a server crash would cause major disruptions for the player experience
* especially under Server Meshing you need to be able to restart individual servers instead of having to restart the entire meshed system, which essentially would be all servers if just one server crashes

__Solution:__ Game Server Crash Recovery and Client Reconnects

__Requirement for:__ Server Meshing

__Goals:__

* utilize the data stored in the EntityGraph to recover individual, crashed game servers and allow players to continue to play with minimal interruption and barely any loss of player progression and items

__Approach:__

* Alpha 3.15 came with basic crash recovery for ships by showing player ships into the Global Database (LTP) on server crash. From there, it then can be spawned again on another server by the player at a Terminal with the cargo fully available. This was a first workaround before the actual server crash recovery that will allow us to keep playing exactly where the game left us off (e.g. inside our ship while Quantum Travelling).

With 3.23.0 onwards, on a game server crash a new server will be started to take over its job:

* The new game server loads the entities (which the crashed server was responsible for) from the Replication Layer
* The new game server utilizes Server OCS to load these entities into its memory
* The Replication Layer holds the player client connections in the meantime and once the new server is ready to go, the game will continue to simulate for the players. A wait time is and teleporting of entities may be experienced by the player.
* Players will only experience a few minutes of disruption and lose barely any of their progress as most of the data is already persisted in the EntityGraph instead of the crashed game server/server node
* The Replicant and Gateway services are expected to become rather stable (because they dont run complex code, such as the server nodes). Even if one of these services goes down, it is expected take less than a minute for the Relicant and just a few seconds for the Gateway service to be started and the game to be resumed.
