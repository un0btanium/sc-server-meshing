### Humble Beginnings - The Hybrid Service 2/3
The Hybrid service itself actually consists of multiple components, each one with its own functionality that is vital to bring Server Meshing online. Some of that functionality had already come online with the Replication Layer. The components that we know of so far are:

Atlas

* Manages Entity Authority and Authority Transfers

Replicant

* takes care of loading the game world on both client and servers
* takes care of networking the game state for both clients and game servers
* has the game state cached in its own memory, but does not simulate it, as that is the job of the game servers

Gateway

* takes care of sending data from/to player clients

Scribe

* Functionality still unknown. Likely persistence-related.

This is just a quick overview. These services have been talked about in lots more detail in their own Minor Tech slides. But, we are still going to drill down on the Replicant and Gateway components, as these play key roles in Server Meshing. More types of services have been teased but not elaborated on yet.

![Image](/images/static_server_meshing/image-24.png)
