# Shards
### Challenges:
* Because the backend architecture is getting more complex once moving toward Server Meshing, there needs to be new terminology.
* So far, an entire game world has been simulated by just a single game server.
* Under PES and Server Meshing, players won't play on and send/receive data directly from a single game server anymore, a game world is not referred to as a 'game server' anymore.

__Solution:__ Shards

__Requirement for:__ PES, Server Meshing

__Goals:__

* use the term Shard to refer to a (meshed) "game world" (one copy of the Star Citizen universe)
* sometimes the backend servers and services running one such game world is also referred to as the "Shard"

__Approach:__

* Idealy, everyone plays in the same game world, a single world-wide Shard.
* However, until Server Meshing is capable of doing that, there will still be multiple, independent shards running alongside each other, each with their own game world and state. Therefore, initially there will be a multiverse of SC universes, but economy is shared (via the StarSim Economy Simulator).
* The initial milestone/goal is to scale up Server Meshing far enough to support one Single Sshard per region.
* While playing, players and entities can only ever be transferred between game servers of the same Shard, never to server nodes of a different shard.
* Players can still join/switch to another Shards, but this can only happen from the main menu before they start playing, determined by matchmaking/login-flow
