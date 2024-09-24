### Entity Authority & Authority Transfers 3/8
__Speculated:__ To make server handoffs smooth and seamless, there might be an area at the borders in which game servers overlap slightly, meaning both servers load the same entities into memory. Therefore, we have updated the boxes to also overlap. The authority transfer might still happen at a fixed boundary tho.

We also need to highlight which server computes which entities. For this reason, we now color the players by the color of the game server who currently is responsible for simulating it. Our blue player being computed by Server Node 1 turned red, and the other two players on Server Node 2 turn/stay green.

When a game server simulates an entity, then we say that this game server has authority over the entity and its state. This feature is called Entity Authority and we will explore this in more depth in later slides.

For now, let us see what happens, when the Blue player (now red to signify that game server 1 has authority and simulates it) is about to transport cargo from Microtech on Server S1 to Hurston on Server S2.

![Image](/images/static_server_meshing/image-10.png)
