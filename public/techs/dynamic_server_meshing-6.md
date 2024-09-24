### Dynamic Server Meshing Version 2 2/2
We do that by splitting a single zone into even smaller sections, which have been called "simulation islands". This way a big zone can then be assigned to multiple game servers again, sharing the load.

In our example, the spacestation zone can be split into two smaller simulation islands and the green servers can help out simulating one of those islands.

__Note:__ It is still unclear if individual entities can be group up into such an island or if new zones are spawned on-demand. If it is individual entities, then it could be possible to put interacting entities into the same group (e.g. two ships shooting each other) instead of being restricted to spatial sections.

![Image](/images/dynamic_server_meshing/image-10.png)
![Image](/images/dynamic_server_meshing/image-11.png)
![Image](/images/dynamic_server_meshing/image-12.png)
