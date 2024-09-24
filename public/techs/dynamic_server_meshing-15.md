### Replication Layer V2 - Scaleup
Once this new architecture is working well, the whole thing is going to be scaled up. Meaning, we might have multiple Gateway and multiple Replicant services beween the clients and the game servers. Services may also be added and removed, ideally on-demand to what is happening ingame.

This way, the game world can be further distributed across the Replicants and more game servers, without overloading any single game server nor Replicant. For example, one Replicant and its game servers may be responsible for simulating the Staton System, while another simulates Pyro and Nyx.

__Speculated:__ Clients may have to establish connections to only one or multiple Gateway services on-demand. Each Gateway service establishes connections to one or more Replicant services.

All of these connections (and/or subscriptions?) are mostly likely managed by a service (Atlas?), since the services, game servers and connections/subscriptions have to be added and removed on-demand. Also in case of handing players and Entity Zones off from one game server/Replicant/Gateway to another.

__Note:__ How many Gateways, Replicants and Server Nodes are required is not known yet. The image shown might therfore not be accurate, as it just tries to visualize the general idea.

![Image](/images/dynamic_server_meshing/image-21.png)
