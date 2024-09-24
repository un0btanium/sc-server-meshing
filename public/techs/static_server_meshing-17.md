### INTERMISSION: State Replication to Game Servers (Client Views for Game Servers)
When game servers overlap in the virtual space, they load the same entities into their memory. This is what Server OCS does. Since only one game server can have authority over an entity at a given point in time, the Hybrid service can decide to send state updates to other game servers which do not have authority over that entity. This is the same or similar entity state data which the player clients receive. Which is why CIG initially explained it as "client views for game servers".

This way game servers can let each other know what's going on and keep entities synchronized on multiple game servers. This can then be used for those seamless authority transfers between game servers.

__Speculated:__ For collision checks between two entities on different game servers there might have to be a consensus reached by the game servers or decided by the Hybrid/Replicant service.

![Image](/images/static_server_meshing/image-16.png)
