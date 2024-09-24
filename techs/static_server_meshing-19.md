### Entity Zones - Game World splitting via the ZoneSystem 2/2
As Zones can be nested (e.g. a landing zone on a planet or a vehicle inside a spaceship and the spaceship inside a hangar on a planet), a tree data structure of Zones emerges. Such a tree data structure can be split into multiple sub-trees.

One such sub-tree could then be computed by one server node. Sub-trees themselves can be further split or merged into more or fewer sub-trees and thus Territories. We will revisit the Zone System under Dynamic Server Meshing, where an algorithm will determine, which Zones are going to be part of which server node, factoring in the load in those Zones. For now, these zones will be assigned to game servers manually by the developers.

![Image](/images/static_server_meshing/image-20.png)
![Image](/images/static_server_meshing/image-21.png)
![Image](/images/static_server_meshing/image-22.png)
