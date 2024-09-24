### Endgoal of a Single Game World
Therefore, the ideal end goal is to have all players in the same game world. Thus, can meet up, see and interact with each other freely. With only one game world, there would only be one universe and no "multiverse" anymore.

This is going to be achieved by having all DGS computing the same game world. For this to work, different entities are computed by different DGS. So each game server only has to simulate a small amount of entities instead of all entities in the game world. The game server that is responsible for simulating an entity is said to have authority over that entity. This authority can also be handed off between game servers.

At the same time, the networking logic of Client OCS will make it possible for players on two different game servers to still see and interact with each other.

Under Server Meshing, a game world is referred to as a Shard, a term coined by the MMO Ultima Online. Note: These are 'Game World Shards', not Database Shards (see the Persistent Entity Streaming topic).

However, while this is the end goal, for this single Shard/Game World to work it might require a very mature Dynamic Server Meshing implementation and capable lag compensation netcode. Until then - before all DGS are computing one and the same game world - we will have multiple intermediary versions of Server Meshing. In those versions, we will continue to have multiple game worlds (and thus still a multiverse).

![Image](/images/static_server_meshing/image-04.png)
