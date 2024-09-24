# Scribe
### Overview
Scribe is one of the components of the initial Replication Layer/Hybrid Service but will be its own scalable service later on.

__Solution:__ Scribe component/service

__Requirement for:__ Persistent Entity Streaming, Server Meshing

__Goals:__ write data sent by the game servers to the backend databases

__Approach:__

* This service seems to be related to persisting entity state from the Replication Layer/Hybrid service into the EntityGraph database (and maybe GlobalDB too). The word "scribes" has been mentioned in this context in the 2021 Server Meshing CitizenCon presentation at 20:58. It was first mentioned only briefly in the Server Meshing Q&A. However, at this point in time, there is very little known about the Scribe service.
* The Scribe component likely came online in Alpha 3.18 as part of the Replication Layer to communicate with the EntityGraph.
* The Scribe service will come online once the Hybrid Service is broken up (see Replication Layer V2).
