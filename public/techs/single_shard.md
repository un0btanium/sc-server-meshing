# Single Shard

![Image](/images/milestones/milestone-05.png)

### Overview
Even if a first Dynamic Server Meshing has been released, there is still more work left to be done to have it scale up and make a single shard possible.

__Challenges:__

* the early versions of Server Meshing wont be powerful enough just yet to allow all players to play in the same game world; we will continue to play in a multiverse, albeit less and less over time as shards grow in terms of how many players can support.

__Solution:__ Single Shard, one game world per region/world through architectural scaleup

__Goals:__

* have all players of a region or worldwide play in the same game world.
* gradually/iteratively improve and scale up Server Meshing until a single shard universe is possible .

__Approach:__

* scale up the amount of servers per Shards high enough so that all players can fit into a single shard.
* The first milestone/goal is going to be one shard per region (all players from US play on their own single shard, all players from EU play on their own single shard, etc).
* The final goal is offering a world-wide shard.
* This will require further R&D on how to reduce the impact of high cross-region latency.
* For scenarios where areas have extremely high population, a layering technique might be introduced that puts interacting players into their own layer (speculated: similar to instancing?).
* Speculated: There might be a time period where CIG will offer one shard per region as well as one world-wide shard. For the developers, this would provide a testbed for global shard tech, while offering the players a choice between an experimental experience in the global shard and a more stable one in the regional ones.

### From Multiple Shards to Single Shard 1/4 - Static Server Meshing
Initially- under static server meshing - all shards will be statically meshed. That means multiple, small and equally sized shards. Each region will have its own shards.

Even tho the individual shards are statically meshed, the number of shards can still change. For example, a new shard is spun up whenever more players login and want to play and all other shards are already full.

![Image](/images/single_shard/image-01.png)

### From Multiple Shards to Single Shard 2/4 - Dynamic Server Meshing
Once we have a mature Dynamic Server Meshing version online, shards start to be come larger and can end up being of different sizes, depending on the amount of players/entities and activity inside them. Each region will still have multiple shards.

![Image](/images/single_shard/image-02.png)

### From Multiple Shards to Single Shard 3/4- Regional Single Shards
Once Dynamic Server Meshing becomes powerful enough to support all players of a region, we may have Single Regional Shards. All players of a region will then be playing in the same game world.

![Image](/images/single_shard/image-03.png)

### From Multiple Shards to Single Shard 4/4 - World Wide Shard
Once Single Regional Shards are possible, work can begin on improving the lag compensation techniques. Those reduce perceived effects of latency for the players when playing across regions where latencies of over 200ms are possible. But further R&D is required for this. If it is possible and enjoyable, then all players play in a Single Worldwide Shard.

__Speculated:__ CIG might start offering an optional 'Worldwide Region' that will run alongside the existing regions, so players can choose between the regional and the worldwide shard. And maybe some day, the tech becomes capable enough where only the world-wide shard remains and the regional ones are removed.

![Image](/images/single_shard/image-04.png)

### Remaining Technical Limitations: Player Client = The Final Frontier
One final technical hurdle, that might not be completely overcome without some additional tricks and workarounds in the end, will be the rare scenario where thousands of players/entities are very close to each other and thus directly visible to the player client (like on a large flat surface on a planet). Even tho the game servers might be fine, the CPU/GPU computation on the player client might exceed its limits, resulting in dropping performance.

One way to push performance on the client would be to skip more network updates and simulation for further away objects to reduce the network bandwidth (Entity Component Update Scheduler can be improved to enable this). In terms of rendering, using the same, low level LOD asset for all far away player characters and vehicles would help with the rendering performance on the GPU (which may look worse but would still give the sense of a large, active crowd). But depending on the size of the crowd and the amount of objects, the experience might still not be great.

A drastic but simple workaround would be to limit the amount of objects to a small radius around the player (leading objects to pop-in and pop-out of existence in the distance), lockdown certain game areas via game mechanics (close jumppoints, NPC blockade, et.) or to create layers (parallel instances?) of the same area, taking into account friend and foe of players, but both of these solutions would have severe implications for gameplay that would need to be taken into account.

Anyways, in case of such a scenario, this quickly goes into the realm of major speculation with lots of possible solutions, so I guess we will leave it here and will know more once that point is reached. For the overwhelming majority of situations in the game, the system of Dynamic Server Meshing is expected to perform very well, because other players and objects will be far away or hidden inside buildings and ships and therefore can be hidden from the player client and reduce memory, CPU and GPU load to feasible levels without the need of workarounds.

