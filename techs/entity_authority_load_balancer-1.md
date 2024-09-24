# Entity Authority Load Balancer
### Overview
For Server Meshing to become dynamic, there needs to be some kind of logic implemented that will automatically decide how authority over entities is distributed across the game servers. Because under Dynamic Server Meshing, game servers are not supposed to be assigned fixed locations to simulate, and instead are allowed to follow their players around, loading and simulating any part of the game world the players visits. The rule that only one game server is able to have authority over an entity still applies, so server-to-server communication can also happen anywhere in the game world, not just at the predefined borders, like under Static Server Meshing.

However, not a lot is known about this feature and in which form it will be implemented (e.g. utilizing a clustering algorithm).

__Speculated:__ This might also be the functionality of the Atlas service which might take over the role of not only keeping track of authority but also deciding how it should the game world should be split.

