### Replication Layer V2 - Architecture Changes
Without the Hybrid Service, the backend architecture is going to change, since player clients and game servers wont be able to connect to the Hybrid Service anymore.

Instead the player clients connect themselves to the Gateway service, while the game servers are connecting themselves to the Replicant service. The Gateway service establishes a connection to the Replicant service.

While there are now more services and network connections, overall, the behaviour of the Shard will stay the same as we had with the Hybrid Service. Therefore, this might be rolled out in a patch to achieve feature parity.

__Note:__ The name "Replication" stems from data being copied/replicated. "Layer" suggests that the data is passed through a layer before reaching its actual destinations (clients, server nodes and/or databases). A data packet is received, replicated, then send out to multiple, different computers/consumers.

![Image](/images/dynamic_server_meshing/image-20.png)
