# Serialized Variable Culling
### Overview
Thanks to the Entity Component Update Scheduler, the server was already able to skip updates of certain entities when they are far away from the players.

__Challenges:__

* however each client was still send all updates of all entitiy around ALL players and thus had to update their components when new network information was received from the game server
* this put unnecessary load on the client CPU by having it compute objects in far away places (at the time the in-development Persistent Universe consisted of Port Olisar, Levski and GrimHEX and players could already be far apart)

__Solution:__ Serialized Variable Culling (released in Alpha 3.1)

__Requirement for:__ Client Object Container Streaming

__Goals:__

* only send updates of the entities which are in near proximity of the player to that specific client
* for the first time, it allowed CIG to run the client on partial information about the game world running on the game server

__Approach:__

* utilize the already created software systems (mainly the Entity-Component-Update-Scheduler and likely its networking policies) to determine which client requires which object data
* put a system in place that will only send network updates to the client that is in the near proximity of the updated entity
* now each client only receives the information that that specific client requires, reducing the load on the client CPU
