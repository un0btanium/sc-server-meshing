# Prologue & Summary
### Summary
This concludes our journey to Dynamic Server Meshing. So what did we learn today? (hi jared =D)

__Object Containers:__ Complete engine rework that splits the entire level into individual, reusable level building blocks aka Object Containers.

__Client OCS:__ Allows clients to only load and network the nearby level areas by being provided a partial view into the server's level.

__Server OCS:__ Allows the game server to only load level areas where there are players inside by being able to load and unload objects into a database. Essentially the game server has a partial view into the entire level which resides in the database.

__Persistent Entity Streaming:__ Allows the game objects and their state to persist across time. It introduced a graph database to store and query the data and the Replication Layer service to have a central place for loading, networking and simulation distribution decisions.

__Static Server Meshing:__ Splits the level into a fixed number of sections and computes each one on its own game server. Players are seamlessly transferred between servers when traveling between these sections. Players can look into multiple servers/sections at the same time.

__Dynamic Server Meshing:__ The servers are not fixed to a specific sections of the game world anymore and instead are able to follow their players wherever they go. Game servers can be spun up and down whenever the load demands it, making larger shards possible.

__Single Shard:__ Scaling shards may allow all players of a region to play in the same shard. Maybe even a global shard across shards.

![Image](/images/milestones/milestone-06.png)
### Conclusion
If you made it this far, thank you for reading. I hope that this presentation was able to provide a good overview and a new appreciation for these technologies. As we can see, a lot of work has already been completed and we are getting ever closer to Dynamic Server Meshing for Star Citizen being a reality. Even after the release of Dynamic Server Meshing, all these software systems we talked about will most likely be continuously maintained, iterated over and optimized over many years to keep improving on the player experience and allow for larger Shards.

While this is the end of the major tech explanations, there is still much more information about each of the minor and related technologies left to check out. Feel free to keep on reading! And let me know if you found this overview helpful :)

Also don't forget to check out the sources at the end of the presentation with all the information for yourself!

And a big thanks goes to the developers at CIG for working on these software systems to make Star Citizen a reality!

