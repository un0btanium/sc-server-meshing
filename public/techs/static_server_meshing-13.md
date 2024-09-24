### Entity Authority & Authority Transfers 5/8
The Blue player continues to travel through the level and now the player entity is in the overlapping section. Server OCS continues to do its job and now the player entity is loaded into the memory of both game servers.

At this point, game server 1 starts sending entity state changes of the blue player to game server 2. This allows both servers to have the same/similar entity state. This is referred to as game server 2 receiving a 'client view' of the Blue player. This view is send via the new Hybrid service which we will learn more about soon.

It is important to note that game server 1 still has authority over the Blue player. But it is in this overlapping area (or at the zone/box border) that authority can be handed off to another game server. When a handoff occurs, authority is taken away from game server 1 and given to game server 2. We will see on the next slide that the color of player Blue will turn green.

![Image](/images/static_server_meshing/image-12.png)
