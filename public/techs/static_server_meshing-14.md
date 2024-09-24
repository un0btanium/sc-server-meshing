### Entity Authority & Authority Transfers 6/8
The Hybrid service and its Atlas component is responsible for assigning authority to game servers and decides when authority is transferred between game servers. In the first version of Server Meshing, transfers will only happen in deep space somewhere between planets, but the dynamic versions it is supposed to have that happen anywhere anytime.

Only one game server can have authority over an entity at a time, never more. However, other game servers can receive state updates of an entity from the game server with authority (more on this on the next slide).

As we can see, authority of the Blue player was handed off to game server 2 and we changed to colors to green accordingly. Game server 1 does not simulate the Blue player anymore and instead receives the client view from game server 2.

![Image](/images/static_server_meshing/image-13.png)
