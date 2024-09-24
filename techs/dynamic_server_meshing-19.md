### Multiple Shards
So far, we have only talked about how the Server Meshing functionality is built up and how the individual services, layers and the overall architecture emerge from it. But it is important to note that each Shard consists of one such architecture. Each Shard will have its own Gateway, Replicant, Scribe and Atlas services, as well as its own server nodes and clients.

Multiple such Shards can independently exists at the same time alongside each other (the multiverse). Players can only play in one shard at a time and thus can not see what is going on in other shards.

Certain data still has to be made available to all Shards tho. This data is stored in the Global Database. It also makes it possible to let players switch between shards.

![Image](/images/dynamic_server_meshing/image-25.png)
