# Hybrid Service (Replication Layer Split)
### Overview
__Challenges:__

* for all of the Server Meshing functionality to come online, the newly created services have to come online.
* with such complex interconnected services and infrastructure, the complexity is quite high.

__Requirement for:__ Static Server Meshing

__Solution:__ Hybrid Service (sometimes referred to as the Replication Layer Split or (wrongly) synonymous as Replication Layer)

__Goals:__

* create a new service that sits on its own server in-between the player clients, game servers and the EntityGraph database and is responsible for OCS loading decisions, state networking, caching, persisting, initial game world seeding and managing of entity authority and authority transfers.

__Approach/Goals:__

* Bring the new services called Atlas, Relicant, Gateway & Scribe online, but without the overhead of having to manage and coordinate all of these on their own servers already. And instead, reduce the complexity and infrastructure overhead for the initial versions by having all services run on the same server.
* While the mentioned individual services are planned to run on their own, separate servers later on, for the first version of Server Meshing it is easier to have them all on the same server, as the early versions will still be quite small in scope.
* Clients and game servers of a shard will connect themselves to the Hybrid service of that shard.
* Clients and game servers of a shard will exchange data and authority between each other via the Hybrid service which relays the data between all participants.
* For Dynamic Server Meshing, the Hybrid service is planned to be split up, and each services will be put on its own servers.
* Once that is done, the individual services are going to be horizontally scaled, so that e.g. multiple Replicant and Gateway services are running at the same time. This is how server meshing is going to scale up and allow for more and more players to play in the same shard.
* The Hybrid service consists of the Replication Layer logic (later Replicant & Gateway services).
* First version tested in a 3.21.X Preview Channel.
* It was released with 3.23.0 to Live PU, enabling Server Crash Recovery.
