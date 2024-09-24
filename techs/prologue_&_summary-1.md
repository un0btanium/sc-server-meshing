# Prologue & Summary
### Summary
This concludes our journey to Dynamic Server Meshing. So what did we learn today?

__Object Containers:__ Splits the entire level into individual, reusable level building blocks aka Object Containers.

__Client OCS:__ Allows clients to only load and network the nearby level area by being provided a partial view into the server's level.

__Server OCS:__ Allows the game server to only load level areas with players inside by being able to load and unload objects into a database. Essentially the game server has a partial view into the entire level which resides in the database.

__Persistent Entity Streaming:__ Allows the game objects and their state to persist across time. It introduced a graph database to store and query the data and the Replication Layer service to have a central place for loading, networking and simulation distribution decisions.

__Static Server Meshing:__ Splits the level into a fixed number of sections and computes each one on its own game server. Players are seamlessly transferred between servers when traveling between these sections. Players can look into multiple servers/sections at the same time.

__Dynamic Server Meshing:__ The servers are not fixed to a specific sections of the game world anymore and instead are able to follow their players wherever they go. Game servers can be spun up and down whenever the load demands it, making large shards possible.

