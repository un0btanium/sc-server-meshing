### Replicant & Gateway 1/3 - Object Container loading
The Replicant & Gateway include what could be considered the decision making logic of OCS. Mainly functionality of Network/Entity Bind Culling and Serialized Variables Culling that were introduced as part of Client OCS. If we remember, these were responsible for

* determining which Object Container to load on both the clients and on the game server
* determining which entity state updates have to be send to which player client

__Note:__ The loading logic of OCS that actually loads & unloads the entities into/out of memory via Object Containers still resides on the game servers and player clients.

In the image below we can see the Network/Entity Bind Culling functionality in action. Previously, under OCS, the game server determined which Object Containers it had to load. After the game server had successfully loaded these Object Containers, it then told (some of) the player clients to load those Object Containers as well. Under Server Meshing, the Replicant is going to take over this part for the clients AND game servers. This has the benefit that Object Containers can be loaded on clients and servers in parallel (came online with Alpha 3.17). They dont have to load on the game server first anymore before the client is notified (which was a bottleneck without the Replicant).

![Image](/images/dynamic_server_meshing/image-22.png)
