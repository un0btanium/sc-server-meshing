### Game Update Loop
Games come to life thanks to the game update loop. It simulates the game world by updating all entities multiple times a second. Doing one cycle in the loop is considered to be one game tick and many games execute around 30 game ticks per second.

At the start of each game tick, the game processes the input done by the player. For multiplayer games it also checks for any network updates that were received. The game world is then simulated by executing the update logic of entity (dynamic game objects) in the game world (more on this in the next slides). Once that is done, the game may send the changes made over the network (to a server or client). On the game client, it then triggers the graphics renderer to have it prepare and render a new frame which will then be displayed on the player's monitor.

Server Meshing is about the Simulation and Networking parts of the game update loop to having multiple game servers work together to simulate the same game world without being noticeable for the players.

