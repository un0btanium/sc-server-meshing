# Time & Synchronization Improvements, Connection Process & States Rework
### Overview
__Challenges:__

* first tests of connecting two game servers together helped identify synchronization issues.

__Solution:__ Rework Time And Synchronization logic, Connection Process & States Rework (speculated: might have released sometime mid 2021 already)

__Requirement for:__ Server Meshing

__Goals:__

* ensure that the simulation on both client and server (and soon multiple servers) are better synchronized and networked

__Approach:__

"How the engine measures the passage of time underwent a complete overhaul. Accuracy was improved both in the measurement of time and in its synchronization between server and clients. How the engine uses time to update its logic and physics simulation was changed to eliminate errors that could result in simulation time passing differently on the server and clients. Many smaller bugs that had caused timing errors to grow on long-running servers were also fixed. The network synchronization of vehicles and physics objects were updated to take full advantage of the improvements. The accumulated result of all these changes was a significant reduction in latency and desynchronization issues in many areas, even under harsh test conditions for network and server performance. Besides improving the overall player experience, this work was a necessary step towards server meshing, where simulating the game across multiple game servers would have made desynchronization issues due to timing errors worse." - Postmortem 3.12

"In a server mesh, a client may connect to many different servers during a game session. Part of the work towards server meshing requires separating the process of connecting a client to a server into distinct stages. These stages can then be executed independently without requiring a client to completely abandon its existing game session. Significant progress has been made towards this although there is more work to be done." - Postmortem 3.12

__Speculated:__ This might have released sometime mid 2021 already, maybe Alpha 3.13 or 3.14. Furthermore, this might have been developed for the initial Server Meshing version (show at CitizenCon 2021) where no Replication Layer/Hybrid Service existed yet and game servers connected themselves directly to each other and therefore clients would also have to connected and disconnect themselves from different game servers when moving between game servers. As this version never saw the light of day, this functionality might not be used as such anymore. However, once we have multiple Gateway services, the clients might still need to establish and disband connections to these Gateway services (but never to game servers directly).

