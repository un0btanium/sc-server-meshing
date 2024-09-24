### Replication Layer V2 - Hybrid Service's component splitup
To achieve larger Shards, the individual components of the Hybrid services will be split out into their own servers. The Replicant, Gateway, Atlas and Scribe were components within the Hybrid service, but are then their own services. More types of services have been teased but not elaborated on yet. Once all components are moved out of the Hybrid service, the Hybrid service will likely be removed.

![Image](/images/dynamic_server_meshing/image-19.png)
