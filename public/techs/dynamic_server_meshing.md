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
* "In May 2025, the Network team continued work on Dynamic Server Meshing, separating the DGS assignment from the territory manager."

### Features of Dynamic Server Meshing
The Dynamic Server Meshing (DSM) feature itself can be thought of as multiple sub-features and iterations.

* Dynamic Server Meshing V1 ("Dynamic Entity Zones"): The Entity Authority of Entity Zones can be passed between game servers automatically, to distribute the load optimally between the game servers of a Shard.
* Dynamic Server Meshing V2 ("Dynamic Entity Zone Splitting"): If the load is too high, a single Entity Zone can be further subdivided into "Simulation Islands", which can then be simulated by different game servers again. (Depends on DSM V1)
* Dynamic Starting & Stopping of Game Servers: Adding and removing game servers from a Shard, based on the load within, allows the renting cost of game servers to be reduced to an optimal minimum.
* Splitup of the Hybrid Service components/Replication Layer V2: Once DSM is working, the Hybrid service will become the bottleneck. Therefore, the individual components inside the Hybrid Service will be moved out and onto their own servers, to handle more load. The Hybrid Service will become obselete. (Depends on DSM V1)
* Dynamic Scaling of the Replication Layer V2: Instead of just one service per type, more services can be added (and removed again) so that multiple service run simultaniously and handle more load. This allows Shards to scale higher. (Depends on Replication Layer V2)

Some of these features have to come online before others do, so it is likely that not all of these features come online all at once, and instead get rolled out over multiple patches.


### Entity Zones - Dynamic Game World Splitting 1/2
As we have seen in Static Server Meshing, we are already able to split the game world using Entity Zones (see the images). However, these Zones would be assigned to game servers only at initial startup and setup of a shard and would stay fixed after that. This is one of the aspects that is going to be made dynamic now.

For Dynamic Server Meshing, an algorithm will monitor the load in the Entity Zones and game servers. If one gets overloaded (or underutilised), the algorithm can decide that the load should be distributed differently. It will then re-distributed the Zones across the game servers. This will happen seamlessly while we play.

As an example, lets assume there had been a lot of players at the spacestation in the top left of the level. But now, most of those players are moving over to a location near the top right of the right planet. Under Static Server Meshing, that might leave behind an underutilized red game server while the blue game server is going to be overloaded, maybe because it had a lot of players in one of its other locations already.

![Image](/images/dynamic_server_meshing/image-01.png)
![Image](/images/dynamic_server_meshing/image-02.png)
![Image](/images/dynamic_server_meshing/image-03.png)

### Entity Zones - Dynamic Game World Splitting 2/2
Under Dynamic Server Meshing, we can avoid overloaded and underutilized game servers by re-assigning Entity Zones to another game servers. In our case, it could decide that the red game servers is also going to simulate two Zones of the planet which were previously simulated by the blue game server. This way, the blue game server isnt overloaded and the red game server isnt underutilized.

To accomplish this, an (spatial partitioning) algorithm is going to monitor the load and decide, how the Zones are split and distributed among the game servers. The game servers might be given a period in which they load the other Zones before authority over the Zones are assigned, adding some complexity to the implementation. A special protocol might handle this.

__Note:__ If more players were to join the shard and all game servers are already under optimal load, then the shard might spin up a fourth game server (e.g. a yellow one) and the game world could once again be split up accordingly. Likewise, if players leave the shard, then game servers could be shutdown. But this dynamic functionality of starting and stopping game servers is likely going to be its own separate feature of DSM.

![Image](/images/dynamic_server_meshing/image-04.png)
![Image](/images/dynamic_server_meshing/image-05.png)
![Image](/images/dynamic_server_meshing/image-06.png)

### Dynamic Server Meshing Version 2 1/2
What we saw in the previous slides is just the first version of Dynamic Server Meshing. Once this works well, it will be expanded upon, because there are some ingame scenarios that may not work well with this solution. Mainly if many player meet up in a single zone. Especially in mid- to large-sized zones.

For example, if a lot of players were to go (back) to the spacestation, then the red server is assigned only the space station zone. But if there are so many player that even that isnt enough, a single zone and thus server still gets overloaded

To solve that we will have to make room for another game server.

![Image](/images/dynamic_server_meshing/image-07.png)
![Image](/images/dynamic_server_meshing/image-08.png)
![Image](/images/dynamic_server_meshing/image-09.png)

### Dynamic Server Meshing Version 2 2/2
We do that by splitting a single zone into even smaller sections, which have been called "simulation islands". This way a big zone can then be assigned to multiple game servers again, sharing the load.

In our example, the spacestation zone can be split into two smaller simulation islands and the green servers can help out simulating one of those islands.

__Note:__ It is still unclear if individual entities can be group up into such an island or if new zones are spawned on-demand. If it is individual entities, then it could be possible to put interacting entities into the same group (e.g. two ships shooting each other) instead of being restricted to spatial sections.

![Image](/images/dynamic_server_meshing/image-10.png)
![Image](/images/dynamic_server_meshing/image-11.png)
![Image](/images/dynamic_server_meshing/image-12.png)

### Free roaming of entities
Under Dynamic Server Meshing, most of the core logic of Static Server Meshing will stay intact. It is merely iterated and improved upon to be able to achieve larger Shards with more players and entities in them, while also managing the real world economical side of renting just the necessary/optimal amount of game servers. This is done by scaling the number of game servers and other services (Replicants and Gateway services) to the optimal amount based on ingame load.

For simplicity reasons (and because I felt lazy :D), we have removed the red and green boxes in the image below. The functionalities of Entity Authority, Authority Transfers, Entity Zones and 'client views' between game servers still exist and continue to be utilized, even tho we dont show it here.

![Image](/images/dynamic_server_meshing/image-13.png)

### Free roaming of entities
Without being tied to just one area anymore, game servers are now able to load any area of the game world and be assigned authority over the entities within those areas (and unload and unassigned of areas they leave behind). The game servers can follow their authorized players wherever they travel to. They load the area and will be assigned authority over it; if no other game server has been assigned authority already, that is.

In the example, the players of the green game server spread out in the level and their game server followed them. No authority handoffs to the red game server were performed.

![Image](/images/dynamic_server_meshing/image-14.png)

### Free roaming of entities
When players from different game servers meet up in the same location and the game servers "overlap", then they will load all entities in that area and start exchanging 'client views' of their authorized entities with each other. The same way they did at the section overlaps under Static Server Meshing. This way both game servers can make hit detection and collision checks cross game servers without each having to simulate the entities of the other game server.

![Image](/images/dynamic_server_meshing/image-15.png)

### Free roaming of entities
At this point, authority might be handed off anytime to one of the game servers. But it could also be decided that these players stay on their game servers, so it is also very possible that players stay on their assigned game server throughout their whole play session.

Maybe, most of the time, only interacting entities need to be moved onto the same game server (for example reduce server-to-server communication, the need for consensus techniques and ultimately to reduce computational load and save on game servers). For example, entities that travel past each other (like while flying, especially in Quantum Travel) do not need to be moved onto the same game server.

![Image](/images/dynamic_server_meshing/image-16.png)

### Free roaming of entities
When more players are joining the Shard, or there is more activity and load happening (like a big spacebattle), then more game servers can be spun up and connected to the Shard. The players and entities can then be re-distributed across the game servers for optimal load on each.

Likewise, in the case where a game server crashes, a new one can be spun up (or an existing server can take over for a short while), load the entities again and continue the simulation with only a minor disruption to gameplay.

![Image](/images/dynamic_server_meshing/image-17.png)

### Free roaming of entities
As mentioned, the load will be continuously monitored to try to have a smooth player experience and an economically optimal amount of game servers used. The entities of an underutilised game servers may be moved to another underutilised game server, so that one of those game servers can be shutdown down. In our example, the players/entities of the green game server were moved to blue game server, then the green game server shutdown.

![Image](/images/dynamic_server_meshing/image-18.png)

### Replication Layer V2 - Hybrid Service's component splitup
To achieve larger Shards, the individual components of the Hybrid services will be split out into their own servers. The Replicant, Gateway, Atlas and Scribe were components within the Hybrid service, but are then their own services. More types of services have been teased but not elaborated on yet. Once all components are moved out of the Hybrid service, the Hybrid service will likely be removed.

![Image](/images/dynamic_server_meshing/image-19.png)

### Replication Layer V2 - Architecture Changes
Without the Hybrid Service, the backend architecture is going to change, since player clients and game servers wont be able to connect to the Hybrid Service anymore.

Instead the player clients connect themselves to the Gateway service, while the game servers are connecting themselves to the Replicant service. The Gateway service establishes a connection to the Replicant service.

While there are now more services and network connections, overall, the behaviour of the Shard will stay the same as we had with the Hybrid Service. Therefore, this might be rolled out in a patch to achieve feature parity.

__Note:__ The name "Replication" stems from data being copied/replicated. "Layer" suggests that the data is passed through a layer before reaching its actual destinations (clients, server nodes and/or databases). A data packet is received, replicated, then send out to multiple, different computers/consumers.

![Image](/images/dynamic_server_meshing/image-20.png)

### Replication Layer V2 - Scaleup
Once this new architecture is working well, the whole thing is going to be scaled up. Meaning, we might have multiple Gateway and multiple Replicant services beween the clients and the game servers. Services may also be added and removed, ideally on-demand to what is happening ingame.

This way, the game world can be further distributed across the Replicants and more game servers, without overloading any single game server nor Replicant. For example, one Replicant and its game servers may be responsible for simulating the Staton System, while another simulates Pyro and Nyx.

__Speculated:__ Clients may have to establish connections to only one or multiple Gateway services on-demand. Each Gateway service establishes connections to one or more Replicant services.

All of these connections (and/or subscriptions?) are mostly likely managed by a service (Atlas?), since the services, game servers and connections/subscriptions have to be added and removed on-demand. Also in case of handing players and Entity Zones off from one game server/Replicant/Gateway to another.

__Note:__ How many Gateways, Replicants and Server Nodes are required is not known yet. The image shown might therfore not be accurate, as it just tries to visualize the general idea.

![Image](/images/dynamic_server_meshing/image-21.png)

### Replicant & Gateway 1/3 - Object Container loading
The Replicant & Gateway include what could be considered the decision making logic of OCS. Mainly functionality of Network/Entity Bind Culling and Serialized Variables Culling that were introduced as part of Client OCS. If we remember, these were responsible for

* determining which Object Container to load on both the clients and on the game server
* determining which entity state updates have to be send to which player client

__Note:__ The loading logic of OCS that actually loads & unloads the entities into/out of memory via Object Containers still resides on the game servers and player clients.

In the image below we can see the Network/Entity Bind Culling functionality in action. Previously, under OCS, the game server determined which Object Containers it had to load. After the game server had successfully loaded these Object Containers, it then told (some of) the player clients to load those Object Containers as well. Under Server Meshing, the Replicant is going to take over this part for the clients AND game servers. This has the benefit that Object Containers can be loaded on clients and servers in parallel (came online with Alpha 3.17). They dont have to load on the game server first anymore before the client is notified (which was a bottleneck without the Replicant).

![Image](/images/dynamic_server_meshing/image-22.png)

### Replicant & Gateway 2/3 - Entity State Network Replication
The entity state updates from server nodes are send to select clients and other server nodes of the Shard. This was previously determined by Serialized Variable Culling (part of OCS) in the game server logic, but now done by the Replicant service.

__Note:__ How and where exactly the decision is being made (Replicant and/or Gateway) was not yet clear to me. But we do know that the Replicant is copying parts of the EntityGraph database into its own memory - to cache entity states for quick read and writes, to know about the position of all entities. We also know that the Gateway is supposed to be a very lightweight.

__Speculated:__ Therefore, the Replicant might already be determining to which client(s) it has to be send and the Gateway just replicates and sends the data to the correct clients.

This allows players to receive entity state updates from multiple server nodes. This enables players to look into multiple server nodes and see entities and other players that are computed on other server nodes. This is also used when two server nodes have to sync up entities for an authority transfer/handoff when entities are about to cross from one Territory to the other.

The Replicant will update the data in its own in-memory cache with the data which was send from the server nodes (with authority) and persist these changes back to the EntityGraph database.

![Image](/images/dynamic_server_meshing/image-23.png)

### Replicant & Gateway 3/3 - Player Action Network Replication
In a similar fashion, the clients send their actions to the Gateway which in turn will relay those to the Replicant. And those Replicants will relay it to the correct server nodes that require this information.

__Speculated:__ It might be that the Gateway service also relays client actions directly to other clients, and not just to the Replicant. This would mean that player actions might end up on each others screen quicker. This would minimize latency until the verification from the server nodes would arrive, which in this case would follow shortly after (if the server node disagreed then the client will have to make rollbacks and adjust the entity state). This might be especially useful in a world-wide shard where the latency to the server node in another datacenter might be higher.

![Image](/images/dynamic_server_meshing/image-24.png)

### Multiple Shards
So far, we have only talked about how the Server Meshing functionality is built up and how the individual services, layers and the overall architecture emerge from it. But it is important to note that each Shard consists of one such architecture. Each Shard will have its own Gateway, Replicant, Scribe and Atlas services, as well as its own server nodes and clients.

Multiple such Shards can independently exists at the same time alongside each other (the multiverse). Players can only play in one shard at a time and thus can not see what is going on in other shards.

Certain data still has to be made available to all Shards tho. This data is stored in the Global Database. It also makes it possible to let players switch between shards.

![Image](/images/dynamic_server_meshing/image-25.png)

### Services and Databases
With this system the universe can be dynamically scaled based on the current activities in the game world. Other services and databases like the StarSim Economy Simulation, Dynamic Mission System, Item Cache, Account Database, etc. will be accessible to all game servers.

Ideally, all of these services will be designed in a way that allows them to be horizontally scaled, meaning they can be copied and distributed onto more than one data center. Or they all receive their own cache layer. To achieve a good performance, databases have to be replicated onto multiple data centers across the globe for all game server to have quick access. This also enables redundancy, basically the data is present in multiple identical databases, which in case of a database crash, a new database can quickly be spun up in its place by replicating the data from one of the other, still running databases. This might allow for one single world-wide instance where all players from around the world are able to play together without major interruptions and lag since there will always be a database server near a game server.

Theoretically, with later versions of Dynamic Server Meshing, game servers and Replicant and Gateway services could be geographically re-positioned on-the-fly to another data center where the latency of the currently connected players is the most similar to create a fair playing field for all players by reducing the chance of issues like peekers advantage from occurring. In general, as long as latency is stable and there is not a lot of jitter, network features (such as lag compensation and client side prediction) can guarantee a smooth and fair player experience even with higher latency to servers.

