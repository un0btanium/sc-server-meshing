### INTERMISSION: Database Sharding & Replication 2/3
For example, the data of each planetary system could be its own Database Shard sitting on its own server. These sub-sets can be created through a sharding key and chunks. With these techniques, a router service is able to determine, in which sub-set and thus database shard a specific piece of data is being read from and written to. Therefore, the (also horizontally scalable) router service makes sure that the read and write requests reach the correct database shard. These router lookups are fast operations compared to the actual queries on the DB shards, so dont add a lot of latency.

__Speculated:__ The amount of sub-sets and thus database shards could be changed or even scaled automatically, depending on the load.

EntityGraph uses the common 'Database Sharding' technique. Instead of one database server containing the entire data, the data is instead logically split into sub-sets. And each sub-set is then stored on its own database server, a Database Shard (Important Note: this has nothing to do with 'Game World Shards' which we will learn more about in the Server Meshing topics).

![Image](/images/persistent_entity_streaming/image-06.png)
![Image](/images/persistent_entity_streaming/image-07.png)
