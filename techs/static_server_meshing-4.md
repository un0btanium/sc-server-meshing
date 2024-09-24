### Game Worlds and Game Servers
So far, each game world was simulated by a single game server (also sometimes called Dedicated Game Server or DGS).

Furthermore, we can think of each Game World as its own "Star Citizen universe" with its own, independent state and happenings.

All these game worlds/universes create a "multiverse". We can see this multiverse in the image on the right. Each game world is computed by a single game server/DGS. (The clients connected to the DGS are not shown).

The main downside is that each DGS currently simulates it's entire game world and thus only supports a limited amount of entities, only up to 50 players and after some time ends up being under heavy load from all the loaded entities. Which makes player interactions rather rare and limited.

![Image](/images/static_server_meshing/image-03.png)
