### INTERMISSION: Database Sharding & Replication 1/3
In terms of storage space, a single database might be able to store the entire universe data. But, in terms of processing power, when one day having to serve dozens or hundreds of game servers, it most definitely cant keep up. Too many read and write requests would hit a single database server. Just like game servers, databases have limited computing power. The solution? Splitting up the persisted data and then distributing the load by horizontally scaling the database across multiple database servers.

![Image](/images/persistent_entity_streaming/image-03.png)
![Image](/images/persistent_entity_streaming/image-04.png)
![Image](/images/persistent_entity_streaming/image-05.png)
