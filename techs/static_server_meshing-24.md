### Clients partially looking into multiple server nodes
All entities in the game world are persisted in the EntityGraph database which can be accessed by the Hybrid service (aka Replication Layer or Replicant).

The image on the right visualizes OCS under Server Meshing very well. Specifically how the individual game servers are partially loading and simulating parts of the entire game world with the help of Server OCS. As well as how the player clients looking partially into one or multiple game servers via Client OCS.

![Image](/images/static_server_meshing/image-26.png)
