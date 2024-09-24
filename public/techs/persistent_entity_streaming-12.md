### Service Migration & Economy Simulation
Last but not least, a lot of additional work was done toward Server Meshing in order to allow multiple game servers to share and access the same data of the game world. Many more - here unnamed - services had to be created, some with entirely new functionality, others with existing logic which had to be moved out of the game server code into own services (e.g. the ATC logic responsible for having players and NPC make request and being assigned a free hangar/landing pad).

Similarly, data which is generated from the Economy Simulation will also be made accessible to all game worlds and game servers. Relevant player actions within all game servers will be fed back into the Economy Simulation, to have all players effect each other, even if they are not all playing in the same game world.

Have a look at the "Service Migration & Creation" minor tech slide for more information.

