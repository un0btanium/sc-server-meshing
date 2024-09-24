# Shard Manager
### Overview
__Challenges:__

* a Shard does not consist of a single game server anymore, but multiple servers and services. All of these have to be managed somewhere.

__Solution:__ Shard Manager

__Requirement for:__ Server Meshing

__Goals:__

* manage all the servers and services of a Shard
* setup all relevant data to have the Shard work properly

__Approach:__

* Responsible for setting up a new Shard
* by first starting and managing server nodes & services (Fleet Manager?)
* establishing network connections between services and server nodes
* "seeding" the EntityGraph database with the initial state of the universe (kind of like a "big bang" for that specific SC universe), creating a new game world.
* registering the shard at the Matchmaking service to let players join that Shard.
