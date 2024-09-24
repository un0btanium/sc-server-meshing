# Static Server Meshing
### Overview
After the first version of Client OCS was released, work on Server Meshing could finally begin.

__Challenges:__

* A single game server is still overloaded with the amount of players/entities, and adding more increases CPU load even more.
* Using better server hardware isnt a scalable enough option, so we need to make game servers horizontally scalable instead.

__Solution:__ Static Server Meshing, a first version and intermediate step toward the planned Dynamic Server Meshing implementation

__Goals:__

* Make use of Distributed Computation to have multiple game servers compute the same game world by sharing the computational load.

__Approach:__

* Introduce the concept of Entity Authority which allows the simulation load to be distributed/shared across multiple game servers:
* Each game server can now be assigned 'authority' over specific entities (meaning only that game server determines that entity's state).
* A game server could now simulate just a subset of entities of a game world, instead of all entities by default.
* Introduce the feature of Authority Transfers where the authority over an entity can be seamlessly handed off from one game server to another. Note: While playing, players can only move between game servers of the same game world, not between different game worlds.
* A new Hybrid service is introduced (initially called the Replication Layer, which is also the cornerstone of Persistent Entity Streaming):
* Connects to and coordinates the communication between clients, game servers and the databases.
* Relays entity state updates between clients and game servers.
* Determines which objects should be loaded via OCS on which client and game server.
* Also manages the Shard as a whole, populating the EntityGraph, starting up the game servers and connecting them to the Hybrid.
* Consists of multiple components: Replicant, Gateway, Atlas, Scribe. These will be turned into their own scalable services later.
* New terminology specific to Server Meshing is introduced:
* A game world that is simulated by multiple meshed game servers is referred to as a 'Shard' (a Game World Shard, not Database Shard!)
* A game server is sometimes referred to as 'Server Node' as it is now part of a larger network/mesh.
* For the static version of Server Meshing, limitations are set in place (which will be lifted under Dynamic Server Meshing):
* The game world is spatially split into multiple sections and each game server is responsible/limited to simulating one such section.
* These sections limit the area a game server can have authority over.
* The area of these sections stays fixed/static, as well as the amount of game servers that compute the same game world stays fixed.
* Design for Server Meshing was changed end of 2020/early 2021 to utilize the Replication Layer as a 'middle man' service (instead of using direct server-to-server communication which may have failed to provide the required performance).
* The first version might only come online with at least one game server per solar system and Authority Transfers would happen inside the JumpPoints.
### Initial Situation
With the first versions of Object Container Streaming (OCS) for both client and server done, we are finally able to move onto the initial goal: Server Meshing. Even with the OCS software systems in place, it is not possible to increase the player count to thousand of players nor add tens of thousands of objects into the game world to make 100+ detailed solar systems a reality. A single game server alone is simply not powerful enough.

Since the software technology that is Server Meshing is very complex, it is to be expected that it will take a long time to develop. To provide players a first version sooner, CIG decided to release a simpler, intermediate version of it first: Static Server Meshing.

This should theoretically allow AI improvements, gameplay mechanics and more solar systems and locations as well as slightly higher player counts to be added to the game sooner, even before work on the final Dynamic Server Meshing implementation would be completed. We will talk more about the different versions shortly.

![Image](/images/static_server_meshing/image-01.png)
### A simpler visual abstraction for game servers and clients
Since we are now entering the topic of Server Meshing, we need to represent the network connections of servers and clients in a more simplified fashion.

The left half of the picture shows the server at the top and the connected players with their game clients at the bottom. Together they are forming a single Game World. There exist dozens of these Game Worlds independently from each at the same time. As before, the clients and servers are connected via a network (which in this case would be the internet) to allow information to be exchanged as data packets to have the server and clients stay synchronized.

The right half the picture shows our new simplified version. We now represent the game servers as rectangles and player clients as circles. Since each server and client is unique, we will sometimes identify them with numbers (and colors in the case of the player clients).

![Image](/images/static_server_meshing/image-02.png)
### Game Worlds and Game Servers
So far, each game world was simulated by a single game server (also sometimes called Dedicated Game Server or DGS).

Furthermore, we can think of each Game World as its own "Star Citizen universe" with its own, independent state and happenings.

All these game worlds/universes create a "multiverse". We can see this multiverse in the image on the right. Each game world is computed by a single game server/DGS. (The clients connected to the DGS are not shown).

The main downside is that each DGS currently simulates it's entire game world and thus only supports a limited amount of entities, only up to 50 players and after some time ends up being under heavy load from all the loaded entities. Which makes player interactions rather rare and limited.

![Image](/images/static_server_meshing/image-03.png)
### Endgoal of a Single Game World
Therefore, the ideal end goal is to have all players in the same game world. Thus, can meet up, see and interact with each other freely. With only one game world, there would only be one universe and no "multiverse" anymore.

This is going to be achieved by having all DGS computing the same game world. For this to work, different entities are computed by different DGS. So each game server only has to simulate a small amount of entities instead of all entities in the game world. The game server that is responsible for simulating an entity is said to have authority over that entity. This authority can also be handed off between game servers.

At the same time, the networking logic of Client OCS will make it possible for players on two different game servers to still see and interact with each other.

Under Server Meshing, a game world is referred to as a Shard, a term coined by the MMO Ultima Online. Note: These are 'Game World Shards', not Database Shards (see the Persistent Entity Streaming topic).

However, while this is the end goal, for this single Shard/Game World to work it might require a very mature Dynamic Server Meshing implementation and capable lag compensation netcode. Until then - before all DGS are computing one and the same game world - we will have multiple intermediary versions of Server Meshing. In those versions, we will continue to have multiple game worlds (and thus still a multiverse).

![Image](/images/static_server_meshing/image-04.png)
### Intermediate steps
Over time and across many patches, the amount of game servers per Shard is going to to be increased. And in turn the number of entities (more locations with more items) and players per Shards can be increased as well. Fewer and fewer Shards will be required, until potentially - one day - a single Shard consists of enough DGS so that it can handle the load of all players (of a region/continent or world-wide).

CIG likes to refer to their game servers - on which a game server executable/program runs - as a Dedicated Game Server (DGS). Under Server Meshing, they are also referred to as Server Nodes to highlight the meshed environment. We will use the terms game server, DGS and Server Node interchangeably as they mean the same thing. A server that simulates (a part of) the game world.

However the difference - even in the intermediate Server Meshing versions - is that each game world is already being simulated by more than one game server. The game servers of the same Shard can exchange entity state data with each other. With these network connections, the DGS are "meshed" together, forming a "mesh network" of game servers. The game servers end up being meshed: (Game) Server Meshing.

Once a game world is computed by more than one game server, we refer to that game world as a "Shard". This helps us differentiate the game worlds being simulated by multiple meshed DGS, from the game worlds running on a single DGS ('game world instances' vs 'game world shards'). Each Shard will still be its own SC universe, with its own Stanton, Pyro, Nyx, ect. but do share the same economy from the StarSim Simulator.

![Image](/images/static_server_meshing/image-05.png)
### Shard Transitions vs Entity Authority & State Replication
There are going to be different types of transfers happening under Server Meshing. Lets have a quick look at each one:

* Entity Authority Transfers will only be used within a Shard to pass authority beween two game servers of that Shard. That means authority can never be passed to a game server of a different shard. Remember that each game world has its own contained state of the game world and its own game servers that simulate only that state. An Authority Transfer means that another game server is made responsible for simulating the entity. These authority transfers are happening infrequently and will be more frequent, once Shards are scaled with more game servers simulating different parts of a game world.
* (Player Item) Shard Transfers are transitions that happen across two shards. This can only happen while a player is not actively playing and will eventually be triggered by matchmaking when we are put into a different shard rather than the one we last played on (e.g. because we want to play with a friend on another shard). These Shard Transitions will become less and less frequent the larger shards are scaled, because players are more likely to keep playing in the same Shard across multiple play sessions. Ideally (!) we would have just one Shard, so that no Shard Transfers are necessary.
* There is also Entity State Replication, which could be seen as the transfer of entity state and actions. Here, entity state is send to different machines, such as player clients, the EntityGraph database and other game servers (more on this later). Like Entity Authority Transfers, the replication of state occurs only within the same shard. Sending this state is very frequent and can happen multiple times a second, sometimes on each game tick. Serialized Variables and OCS optimize this.

![Image](/images/static_server_meshing/image-06.png)
### Major and Minor versions of Server Meshing
In the very first version of Server Meshing, each Game World (Universe/Shard) will mostly likely only be computed by a few game servers. Mainly to be able to test the functionality in a simple and controlled environment.

Afterwards, it will be increased to more and more game servers across multiple patches. While there are going to be many of these gradual increases, there are going to be two major versions which Server Meshing can be categorized into:

Static Server Meshing

* A game world is going to be split manually into sections by the developers. Each section will be simulated by one game server.
* The name "static" means that these sections stay unchanged in their virtual size and amount (and thus also the amount of game servers).
* Game servers (indirectly) exchange information whenever necessary, e.g. to allow for seamless transitions and interactions of entities, as well as game servers exchanging entity state with each other where necessary (e.g. for collision checks).
* There will still exist many Game Worlds/Shards along side each other, since not enough computing power will be available yet to fit all players into a single Game World/Shard.
* A performance issue with this implementation exists: when all players of a Shard meet up in one section, then all have to be computed by one game server. Then that game server will be overloaded again, dropping in tick rate and negatively impacting the player experience.

Dynamic Server Meshing

* The size and amount of these sections wont be fixed anymore. Instead each game server is now able to follow its players wherever they go.
* The name "dynamic" also means that the amount of server nodes can increase and decrease, besides the entities a game server is simulating changed on-demand anytime. The game world can be split up differently while we are playing the game.
* All of this is done programmatically, meaning that - for each Shard - an algorithm is monitoring the performance on all of its game servers and then tries to optimally distribute the load across those game servers. More game servers can be spun up or existing, underutilized ones shutdown.
* There will also be multiple minor versions of Dynamic Server Meshing, each increasing the number of game servers per Shard, until eventually all players of a geographical region (EU; US, etc.) fit into one single regional Shard, maybe even all players world-wide into a single word-wide Shard.
### Entity Authority & Authority Transfers 1/8
(Static) Server Meshing splits the level into multiple sections to simulate each one on its own server. For example, the Stanton solar system could be split in half. Then two game servers could compute two planets each.

In our example on the right, this split has been the green and red boxes. We only split the level into two sections, however Static Server Meshing could allow for dozens of sections (e.g. each of the major planets and each of their moons in the Stanton system on their their own server). However, this might be an inefficient use of servers since it could lead to a lot of empty or low load servers. Therefore, it initially will be divided in as few sections as possible for testing purposes, then slowly increased in numbers over subsequent patches, with Dynamic Server Meshing the next goal.

In our example, we split the game world into two sections, red and green.

We are going to explore the concepts of Server Meshing by following the journey of the blue players which is about to travel from Microtech to Hurston.

![Image](/images/static_server_meshing/image-07.png)
![Image](/images/static_server_meshing/image-08.png)
### Entity Authority & Authority Transfers 2/8
In our example, we will have our three players again, just like we did in our previous examples for Client and Server OCS. The difference is that we now have two game servers instead of just one.

We don't show the clients anymore, but remember that loading and networking via Client OCS is still happening. But we rather want to focus on how the game servers simulate and handoff entities between each other (or 'server nodes' as they are also called under Server Meshing).

We can see the split in the level by the green and red boxes. Players Red and Green are busy on the second game server (green box). Meanwhile, player Blue is loading cargo on the first game server (red box). We can see that the servers don't load the entire game world anymore - even if there are players - and instead only focus on their box/section. However, that might not be entirely accurate.

![Image](/images/static_server_meshing/image-09.png)
### Entity Authority & Authority Transfers 3/8
__Speculated:__ To make server handoffs smooth and seamless, there might be an area at the borders in which game servers overlap slightly, meaning both servers load the same entities into memory. Therefore, we have updated the boxes to also overlap. The authority transfer might still happen at a fixed boundary tho.

We also need to highlight which server computes which entities. For this reason, we now color the players by the color of the game server who currently is responsible for simulating it. Our blue player being computed by Server Node 1 turned red, and the other two players on Server Node 2 turn/stay green.

When a game server simulates an entity, then we say that this game server has authority over the entity and its state. This feature is called Entity Authority and we will explore this in more depth in later slides.

For now, let us see what happens, when the Blue player (now red to signify that game server 1 has authority and simulates it) is about to transport cargo from Microtech on Server S1 to Hurston on Server S2.

![Image](/images/static_server_meshing/image-10.png)
### Entity Authority & Authority Transfers 4/8
Once the blue player starts quantum traveling, Server OCS will continue loading and unloading the game world around the players. However, game servers are now limited, in what they can load and can have authority over, to their box. Once the Blue player closes in on the section/box of the server 2, the server will start to load the game world.

This implies multiple game servers may have the same game objects loaded into their memory. Which is one of the requirements to ensure a smooth handoff.

__Speculated:__ How this is going to work exactly is still unclear. Even tho we show that game server 2 would gradually load the game world while the player approaches its section, it might be that a server only starts loading an area once the player entered its section.

![Image](/images/static_server_meshing/image-11.png)
### Entity Authority & Authority Transfers 5/8
The Blue player continues to travel through the level and now the player entity is in the overlapping section. Server OCS continues to do its job and now the player entity is loaded into the memory of both game servers.

At this point, game server 1 starts sending entity state changes of the blue player to game server 2. This allows both servers to have the same/similar entity state. This is referred to as game server 2 receiving a 'client view' of the Blue player. This view is send via the new Hybrid service which we will learn more about soon.

It is important to note that game server 1 still has authority over the Blue player. But it is in this overlapping area (or at the zone/box border) that authority can be handed off to another game server. When a handoff occurs, authority is taken away from game server 1 and given to game server 2. We will see on the next slide that the color of player Blue will turn green.

![Image](/images/static_server_meshing/image-12.png)
### Entity Authority & Authority Transfers 6/8
The Hybrid service and its Atlas component is responsible for assigning authority to game servers and decides when authority is transferred between game servers. In the first version of Server Meshing, transfers will only happen in deep space somewhere between planets, but the dynamic versions it is supposed to have that happen anywhere anytime.

Only one game server can have authority over an entity at a time, never more. However, other game servers can receive state updates of an entity from the game server with authority (more on this on the next slide).

As we can see, authority of the Blue player was handed off to game server 2 and we changed to colors to green accordingly. Game server 1 does not simulate the Blue player anymore and instead receives the client view from game server 2.

![Image](/images/static_server_meshing/image-13.png)
### Entity Authority & Authority Transfers 7/8
The Blue player continues their journey, now simulated by the second game server. Server OCS continues to load and unload the game world accordingly on both game servers. However, the decision making (what needs to be loaded) is not done by the game servers individually anymore and instead the Hybrid service figures out which Object Containers have to be loaded on which game server (and clients as well for Client OCS).

For this, the Hybrid services/Replication Layer makes requests to the EntityGraph database and loads the game world - around the players - into its own memory/cache. That is why we can think of the level shown on the left in our example as the Hybrid service. However, the Hybrid service does not simulate anything. That is the responsibility of the game servers. But we can think of the Hybrid service as having client views of all entities on the game servers.

![Image](/images/static_server_meshing/image-14.png)
### Entity Authority & Authority Transfers 8/8
In our example, the Blue player has now arrived at Hurston and starts selling his cargo for a profit.

We notice that game server 1 now has no players in its section of the game world anymore while all players are on server 2 and have most of the locations loaded. This showcases the bottlenecks of Static Server Meshing very well:

Empty of half full game servers are underutilized (costing as much to rent as game servers under full load), while game servers with too many players/entities can still end up being overloaded again.

These downsides will be overcome with Dynamic Server Meshing, where game servers can be spun up and shutdown on-demand and where the green and red boxes do not exist anymore. There, this "area limitation on Entity Authority" - by assigning sections of the game world to specific game servers - wont exists anymore. Instead, authority will be much more fluid and game servers can follow its players and keep authority over them wherever they go. We will explore this in the Dynamic Server Meshing topic tho. For now lets have a deeper look at the Hybrid service.

![Image](/images/static_server_meshing/image-15.png)
### INTERMISSION: State Replication to Game Servers (Client Views for Game Servers)
When game servers overlap in the virtual space, they load the same entities into their memory. This is what Server OCS does. Since only one game server can have authority over an entity at a given point in time, the Hybrid service can decide to send state updates to other game servers which do not have authority over that entity. This is the same or similar entity state data which the player clients receive. Which is why CIG initially explained it as "client views for game servers".

This way game servers can let each other know what's going on and keep entities synchronized on multiple game servers. This can then be used for those seamless authority transfers between game servers.

__Speculated:__ For collision checks between two entities on different game servers there might have to be a consensus reached by the game servers or decided by the Hybrid/Replicant service.

![Image](/images/static_server_meshing/image-16.png)
### Entity Zones - Game World splitting via the ZoneSystem 1/2
To understand how Entity Authority and Authority Transfers will work, we also need to talk about Entity Zones. In order to have different server nodes of a Shard compute different sections of the game world, there needs to be logic that splits that Game World into such sections. These in-game sections are referred to as Entity Zones (speculated: sometimes called Territories).

Splitting the Game World will make heavy use of the existing ZoneSystem (physics grids). It already splits the Game World into sections (see ZoneSystem topic).

A Zone can be a room, spaceship interior, landing zone or even a planet/moon, planetary system or an entire solar system. Multiple Zones form a tree structure.

Without Server Meshing, the entire Game World can be thought of to be just one single large Territory. All these Zones and all entities within would be computed by exactly one DGS. The entire Game World is therefore computed by a single game server. This is shown in the images on the right, where all zones are marked with a red color. But, on the next side, once we can have multiple DGS (server nodes) working together, there will be many Territories in a single Game World.

![Image](/images/static_server_meshing/image-17.png)
![Image](/images/static_server_meshing/image-18.png)
![Image](/images/static_server_meshing/image-19.png)
### Entity Zones - Game World splitting via the ZoneSystem 2/2
As Zones can be nested (e.g. a landing zone on a planet or a vehicle inside a spaceship and the spaceship inside a hangar on a planet), a tree data structure of Zones emerges. Such a tree data structure can be split into multiple sub-trees.

One such sub-tree could then be computed by one server node. Sub-trees themselves can be further split or merged into more or fewer sub-trees and thus Territories. We will revisit the Zone System under Dynamic Server Meshing, where an algorithm will determine, which Zones are going to be part of which server node, factoring in the load in those Zones. For now, these zones will be assigned to game servers manually by the developers.

![Image](/images/static_server_meshing/image-20.png)
![Image](/images/static_server_meshing/image-21.png)
![Image](/images/static_server_meshing/image-22.png)
### Humble Beginnings - The Hybrid Service 1/3
The Hybrid is a service and the initial heart of Server Meshing.

The Hybrid service sits between the game servers, player clients and the EntityGraph database of a Shard. It can be seen as the glue that connects everything together by coordinating and communicating between clients (represented as circles with a C), game servers (server nodes) and database.

Initially, each Shard will have one such Hybrid service. The server nodes and player clients establish a network connection to the Hybrid to be able to send and receive data from it. The Hybrid will establish a connection to a EntityGraph database to request and store the state of the Game World.

Using a mediator service like this - which sits between everything - makes it easier for the logic on the clients and servers as they don't have to be aware of where their data goes to or comes from. It all goes to the Hybrid first, which takes care to further relay it to the actual destination(s). Furthermore, each server node and client only needs to establish a single connection to the Hybrid, rather than every participant having a connections to all other participants of a shard. The Hybrid reducing the number of direct interactions and required decision making that would otherwise have been done on each game server.

When the Hybrid first comes online, it will only feature a single server node to test it. Once this new infrastructure is working, more server nodes are added and Server Meshing comes online.

![Image](/images/static_server_meshing/image-23.png)
### Humble Beginnings - The Hybrid Service 2/3
The Hybrid service itself actually consists of multiple components, each one with its own functionality that is vital to bring Server Meshing online. Some of that functionality had already come online with the Replication Layer. The components that we know of so far are:

Atlas

* Manages Entity Authority and Authority Transfers

Replicant

* takes care of loading the game world on both client and servers
* takes care of networking the game state for both clients and game servers
* has the game state cached in its own memory, but does not simulate it, as that is the job of the game servers

Gateway

* takes care of sending data from/to player clients

Scribe

* Functionality still unknown. Likely persistence-related.

This is just a quick overview. These services have been talked about in lots more detail in their own Minor Tech slides. But, we are still going to drill down on the Replicant and Gateway components, as these play key roles in Server Meshing. More types of services have been teased but not elaborated on yet.

![Image](/images/static_server_meshing/image-24.png)
### Humble Beginnings - The Hybrid Service 3/3
However, the plan is to eventually move all these components out of the Hybrid to have them be their own services, running on their own servers. Once all components have been taken out, the obsolete Hybrid service will then be removed. This work is done when working on/toward Dynamic Server Meshing, after Static Server Meshing has released.

The individual service types are going to be horizontally scalable, meaning that multiple Replicant services could be running alongside each other. This is how Server Meshing is planned to be scaled up to support many more entities and players.

But - because the Shards for the very first versions of Server Meshing are still going to be very small (few server nodes and player clients) - a need for many services is not there yet. To bring Server Meshing online, have its functionality tested and made robust, a smaller, more manageable environment with a single Hybrid service is much more suitable. The infrastructure complexity and its overhead is minimal and the focus can be on maturing the functionality itself. Once that is working fine, the components will be turned into services and scaled up.

![Image](/images/static_server_meshing/image-25.png)
### Replicant & Gateway - The Deeper Look
The Replicant & Gateway are components of the Hybrid service. However, not all of their code is new. Parts of their functionality already existed as OCS and PES functionality.

OCS had already introduced various logic to load Object Containers on both clients and servers, as well as optimized the networking by only sending entity states to the individual player clients that need it.

And PES moved and grouped that logic as part of the Replication Layer.

For Server Meshing, that logic is now moved into the Hybrid service as part of the Replicant and Gateway components. And for later versions later moved out again, onto their own servers, to make those horizontally scalable and shards larger.

### Clients partially looking into multiple server nodes
All entities in the game world are persisted in the EntityGraph database which can be accessed by the Hybrid service (aka Replication Layer or Replicant).

The image on the right visualizes OCS under Server Meshing very well. Specifically how the individual game servers are partially loading and simulating parts of the entire game world with the help of Server OCS. As well as how the player clients looking partially into one or multiple game servers via Client OCS.

![Image](/images/static_server_meshing/image-26.png)
