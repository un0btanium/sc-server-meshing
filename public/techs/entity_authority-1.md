# Entity Authority
### Overview
__Challenges:__

* The engine/server logic is not designed to have multiple game servers work together because each game server expects to have full simulation control/authority over all entities and not just a small subset (e.g. only part of the Stanton solar system).

__Solution:__ Entity Authority (aka Authority API, initially as If-Statement Refactor) (work began in 2020, first released in Alpha 3.13/3.14 (just feature parity))

__Requirement for:__ Server Meshing

__Goals:__

* Allow the game servers in a mesh/shard to share their simulation over the game world.
* Let game servers exchange entity state, by letting other game servers of the mesh/shard appear as special "clients" to a game server.

__Approach:__

* Authority functionality already existed but didn't support multiple game servers, and thus thousands of if-statements were touched in the code
* in programming an if-statement alters the execution of the program to perform different logic. In this case the server needs to know if he has the authority over an entity or not, to either update it or perform a different kind of logic (like receiving state data from another game server).
* "In preparation for server meshing, the team performed a sweep on the remaining tasks to convert code to the Authority API. Over the last 12 months, there has been a coordinated effort by all teams to update the game-end engine code to this new system. Thanks to their work, a large majority of these tasks have been completed. With a concerted push, we’ve reduced the number of remaining tasks into single digits" - Postmortem 3.12
* "The Authority API is to let servers know which entities they have authority/control over. [...] in server meshing we need this to distribute control over entities to different servers.

In the original client-server architecture code could just assume that if it was running on the server it would have control over any entity. Because the engine was designed so that clients and servers run a lot of the same code, there were thousands of places in the codebase that needed to check if it was running on a server or not. Some of these checks control systems that are only available to a server but others were really asking if the program had authority over an entity. It's the latter category that needed replacing with the Authority API. However there was no way to tell the cases apart other than looking at every one of the checks individually and deciding if it needed to change.

Being such an enormous amount of work, this conversion was split over all the teams, file by file. This still resulted in hundreds of tasks but thanks to everyone's hard work it's now almost complete. [...]" - Clive Johnson, Spectrum Post "What is the Authority API?" (Feb 2021)

* The Entity Authority feature might have released mid 2021 already, mainly to test if the engine continues to work the same with the new changes (feature parity). Using Entity Authority under Server Meshing requires work on additional features which were released in later patches. This includes Authority Transfers and Atlas which release in a later patch which will enable Server Meshing and being handed off between two game servers.
