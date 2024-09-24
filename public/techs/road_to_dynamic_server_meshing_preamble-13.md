### Game Update Loop - Game Simulation 1/4
For the state of each entity, there is an area of memory reserved. Each location in memory can be addressed by a unique "identifier": its memory address. Therefore, memory can be thought of as one long tape where data/values/state can be read from, changes made and written back to.

On each game tick, the state of the entities are updated when the game is simulated. For example, the position of the entity (e.g. a player or spaceship) in the game world.

In the image on the right we have a player positioned at coordinate x=10 and y=25. Those two values exist at the memory addresses 192 and 256.

![Image](/images/road_to_dynamic_server_meshing_preamble/image-05.png)
