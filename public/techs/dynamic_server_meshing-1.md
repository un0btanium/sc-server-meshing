# Dynamic Server Meshing

![Image](/images/milestones/milestone-04.png)

### Overview
With splitting the game world and its simulation with Entity Authority, the next step is to make this solution dynamic for better scalability.

__Challenges:__

* while the individual servers are now less likely to hit their memory and CPU load capacities, the issue of too many players being in the same section of the game world, and thus on the same game server, still exists
* one solution would be to make the sections of all game servers very small, so that each one only has very few locations and spaces to compute. However, this increases server expenses and potentially to a lot of unoptimally used servers.

__Solution:__ Dynamic Server Meshing, dynamically distributing the simulation through load balancing

__Goals:__

* allow for very high player and entity count within a Shard (on the server-side; this shouldnt improve client-side performance)
* ideally, allow all players to play in one single Shard (either one Shard per region and/or even a single world-wide Shard)

__Approach:__

* The Entity Authority limitation for the game servers - game servers responsible for a fixed section of the game world - is lifted.
* Instead game servers can follow their 'authorized' players freely while those travel through the game world.
* Game servers can now overlap (in what they load), exchange 'client views' and transfer authority anywhere in the game world.
* New functionality is introduced as well:
* An algorithm/heuristic is introduced, which continuously monitors the computational load in the game world and decides for an optimal distribution of the computational resources (servers), by moving entities and their authority from an overloaded game servers to a underutilized game server.
* Whenever a Shard becomes too crowded/overloaded, an additional game server is spun up to provide more computational power. Likewise, game servers can be shutdown, if there is not much load. Less servers rented, more cost-efficient Shards.
* Break up the Hybrid service into smaller horizontally scalable services to allow for larger meshes/shards.
