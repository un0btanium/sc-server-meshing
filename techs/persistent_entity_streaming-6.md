### INTERMISSION: Database Sharding & Replication 3/3
But what would happen if one such database shard crashes or is not reachable? To minimize the loss of data and increase fault tolerance and service availability, EntityGraph also makes use of Database Replication. A data sub-set does not exist on just one database shard, but across additional database shards, which are called Replicas. With this, the same data exist as copies on multiple database servers at once (also known as Data Redundancy). These Replicas can be used to make queries against and loaded from, allowing more requests to hit the EntityGraph.

This also enables database crash recovery functionality: If one database shard goes down, another Replica can take over. The crashed database shard (or Replica) can be spun up again and the data can be copied/replicated back to ensure that there are always enough servers with the copies of the same data available and no data is ever lost.

Going forward we will show and talk about EntityGraph as if it is just one database server. But remember, especially once game worlds are simulated by multiple game servers, that each game world will have its own EntityGraph (collection), consisting of many database shards and router services. (Or - speculated - each game world has its own separate collection in one large EntityGraph database.)

![Image](/images/persistent_entity_streaming/image-08.png)
