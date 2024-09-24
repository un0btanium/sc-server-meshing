### Intermediate steps
Over time and across many patches, the amount of game servers per Shard is going to to be increased. And in turn the number of entities (more locations with more items) and players per Shards can be increased as well. Fewer and fewer Shards will be required, until potentially - one day - a single Shard consists of enough DGS so that it can handle the load of all players (of a region/continent or world-wide).

CIG likes to refer to their game servers - on which a game server executable/program runs - as a Dedicated Game Server (DGS). Under Server Meshing, they are also referred to as Server Nodes to highlight the meshed environment. We will use the terms game server, DGS and Server Node interchangeably as they mean the same thing. A server that simulates (a part of) the game world.

However the difference - even in the intermediate Server Meshing versions - is that each game world is already being simulated by more than one game server. The game servers of the same Shard can exchange entity state data with each other. With these network connections, the DGS are "meshed" together, forming a "mesh network" of game servers. The game servers end up being meshed: (Game) Server Meshing.

Once a game world is computed by more than one game server, we refer to that game world as a "Shard". This helps us differentiate the game worlds being simulated by multiple meshed DGS, from the game worlds running on a single DGS ('game world instances' vs 'game world shards'). Each Shard will still be its own SC universe, with its own Stanton, Pyro, Nyx, ect. but do share the same economy from the StarSim Simulator.

![Image](/images/static_server_meshing/image-05.png)
