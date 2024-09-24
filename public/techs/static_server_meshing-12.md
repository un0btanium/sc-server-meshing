### Entity Authority & Authority Transfers 4/8
Once the blue player starts quantum traveling, Server OCS will continue loading and unloading the game world around the players. However, game servers are now limited, in what they can load and can have authority over, to their box. Once the Blue player closes in on the section/box of the server 2, the server will start to load the game world.

This implies multiple game servers may have the same game objects loaded into their memory. Which is one of the requirements to ensure a smooth handoff.

__Speculated:__ How this is going to work exactly is still unclear. Even tho we show that game server 2 would gradually load the game world while the player approaches its section, it might be that a server only starts loading an area once the player entered its section.

![Image](/images/static_server_meshing/image-11.png)
