### Entity Authority & Authority Transfers 8/8
In our example, the Blue player has now arrived at Hurston and starts selling his cargo for a profit.

We notice that game server 1 now has no players in its section of the game world anymore while all players are on server 2 and have most of the locations loaded. This showcases the bottlenecks of Static Server Meshing very well:

Empty of half full game servers are underutilized (costing as much to rent as game servers under full load), while game servers with too many players/entities can still end up being overloaded again.

These downsides will be overcome with Dynamic Server Meshing, where game servers can be spun up and shutdown on-demand and where the green and red boxes do not exist anymore. There, this "area limitation on Entity Authority" - by assigning sections of the game world to specific game servers - wont exists anymore. Instead, authority will be much more fluid and game servers can follow its players and keep authority over them wherever they go. We will explore this in the Dynamic Server Meshing topic tho. For now lets have a deeper look at the Hybrid service.

![Image](/images/static_server_meshing/image-15.png)
