### Game Update Loop - Game Simulation 2/4
On each game tick when simulating, these values are read and then incremented by the current velocity of the player, then saved back in the same position in memory.

In our example on the right, in the first game tick, the x position was increased by 5 and the player moved a short distance in the game world.

A game tick can be thought of like one "move" when playing a board game. Just that all object in the game world receives their move in one game tick. So all objects make their move at once and, ideally, 30 times per second.

![Image](/images/road_to_dynamic_server_meshing_preamble/image-06.png)
