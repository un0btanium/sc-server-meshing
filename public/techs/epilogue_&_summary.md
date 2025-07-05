# Epilog & Summary
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


### Recap of major tech features releasing and player count increasing

* Alpha 2.2 - Mar 2016 - ***Increased player count from 16 to 24***
* Alpha 2.6 - Jan 2017 - Object Containers (preview/feature parity)
* Alpha 3.0 - Dec 2017 - ***Increased player count from 24 to 50*** - Object Containers, Entity Components, 64bit coordidnates, Zone System, planet tech, new render pipeline, and many more (Large Engine Rework that started ~2014/2015)
* Alpha 3.3 - Nov 2018 - Client OCS
* Alpha 3.8 - Dec 2019 - Server OCS
* Alpha 3.8.2 - Feb 2020 - Long Term Persistence DB (later reworked into the Global DB), less wipes between patches
* Alpha 3.13/3.14 - Apr/Aug 2021 - Preparations for the Replication Layer in the game server code
* Alpha 3.15 - Nov 2021 - Release of the Global Database, Global Persistence and Physicalized Items and Inventory (uses RL to make backend DB calls)
* Alpha 3.17 - Apr 2022 - Entity State Networking through the Replication Layer (networking part of OCS moved into RL)
* Alpha 3.17.2 - Jul 2022 - ***Increased player count from 50 to 100-150+, softcap*** - Networking/Netcode Improvements
* Alpha 3.18 - Mar 2023 - Gen12 + EntityGraph Database + OC Loading via Replication Layer (+cache for Global DB queries in EntityGraph services, all of OCS in RL)
* Alpha 3.23 - May 2024 - Replication Layer moved out of the game server into its own server (Hybrid Service)
* Multiple Tech Channel Previews - throughout 2024 - tested with up to 1000+ players - Static Server Meshing Testing
* Alpha 3.24 - Aug 2024 - Replication Message Queue Refactor
* Alpha 4.0 Preview - Dec 2024 - ***Increased player count from 150+ to 500-600+, softcap*** - Static Server Meshing release, with Jumppoints and the Pyro solar system
* Alpha 4.? - Work In Progress - Dynamic Server Meshing V1

### Conclusion
If you made it this far, thank you for reading. I hope that this presentation was able to provide a good overview and a new appreciation for these technologies. As we can see, a lot of work has already been completed and we are getting ever closer to Dynamic Server Meshing for Star Citizen being a reality. Even after the release of Dynamic Server Meshing, all these software systems we talked about will most likely be continuously maintained, iterated over and optimized over many years to keep improving on the player experience and allow for larger Shards.

While this is the end of the major tech explanations, there is still much more information about each of the minor and related technologies left to check out. Feel free to keep on reading! And let me know if you found this overview helpful :)

Also don't forget to check out the sources at the end of the presentation with all the information for yourself!

And a big thanks goes to the developers at CIG for working on these software systems to make Star Citizen a reality!

