### Game Update Loop - Game Simulation 4/4
Therefore, on each game tick, all entities only ever teleport from one position to the next. Smooth motion emerges because they are updated and teleported multiple times a second (~30 times). This is how the game world is simulated on the CPU.

These values (and/or player inputs/actions) may be send over a network (to either the clients or the server) as well as used to render an image on the player client's GPU.

In terms of rendering, there are a few tricks like Interpolation to have smooth motion of entities when the frame rate is higher than the update tick rate of the game loop. E.g. with 30 game ticks/sec but 60fps, every second position of an entity is estimated on the current and previous position to ensure smooth motion on screen.

__TODO:__ collision checks between game objects

![Image](/images/road_to_dynamic_server_meshing_preamble/image-08.png)
