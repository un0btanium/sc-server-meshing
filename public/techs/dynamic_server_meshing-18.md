### Replicant & Gateway 3/3 - Player Action Network Replication
In a similar fashion, the clients send their actions to the Gateway which in turn will relay those to the Replicant. And those Replicants will relay it to the correct server nodes that require this information.

__Speculated:__ It might be that the Gateway service also relays client actions directly to other clients, and not just to the Replicant. This would mean that player actions might end up on each others screen quicker. This would minimize latency until the verification from the server nodes would arrive, which in this case would follow shortly after (if the server node disagreed then the client will have to make rollbacks and adjust the entity state). This might be especially useful in a world-wide shard where the latency to the server node in another datacenter might be higher.

![Image](/images/dynamic_server_meshing/image-24.png)
