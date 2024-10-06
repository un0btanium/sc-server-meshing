# Service Migration & Creation
### Challenges:
* with server meshing having multiple game servers compute the same game world (which is just data), those game servers will have to share and access the same data
* the data can not be stored on the game server anymore but made accessible to all game servers

__Solution:__ put everything into its own service for all game servers to access

__Requirement for:__ Persistent Streaming, Server Meshing

__Goals:__

* use the single responsibility principle of only having the game servers compute the game world for the players while executing separate logic and storing data on separate servers/services

__Approach:__

* move code and logic that is going to be used by multiple game servers outside of the server code and into a separate service to be run on its own server (not a game server). A few of those required rewrites.
* the network code's Replication Layer (collection of Client OCS minor techs) is moved out of the game server code (into the Hybrid service)
* Matchmaking/Login Flow has been reworked to assign players automatically via various weighted factors onto different servers/shards.
* ATC (Air Traffic Control) has to manage and keep track of free and occupied landing pads and requests from players and NPCs (potentially made by multiple servers or different servers across time).
* a NPC Character Creation Service "will aid in the creation of AI at specific locations for specific reasons, such as the StarSim Economy Simulation."
* NPC Scheduler Service "is meant to add and remove NPC's to the game, dynamically spawning them into and out of the 'verse based on NPC Archetype, Maximum number of NPC's in a given area, and the probabilities of those NPC Archetypes."
* The AI Info Service "will continuously track the position of players, NPCs, and other entities so that our live-service tools can display them properly in real-time."
* NPC Tracker Service "tracks and records the actions of players and NPCs. In turn, Bounty Hunting gameplay will use this service to expose the actions taken by outlaws so they can be tracked by Bounty Hunters."
* Identity Service "will be a proxy service that will relay information about accounts between the RSI platform, Tavern (Spectrum) and the game client."
* Reputation and Org Service "will introduce the first iteration of persistent reputation between all entities within the Star Citizen universe, as well as persistent NPC organizations."
* Reward Service "tracking stats and data per player, and awarding in-game rewards to them, as well as collecting, persisting and querying those player rewards"
* Configuration Service: "This service is responsible for real-time distribution of configuration to services and clients."
* the StarSim Economy Simulator and Virtual AI Service for both Quanta, Virtual NPC and Dynamic Event computation as well as databases related for storing StarSim generated data (probability volumes and values, store commodity prices)
* Subsumption Service/Server Mission Logic "The porting of core Subsumption mission code to a service and implementation of a select subset of tasks to be used on that service. Includes implementing communication between service and mission logic running on game server."
* Both the mission logic and the transit system had to be reworked to support Server Meshing.
* Services Distributed Load Testing System "Development of a distributed load testing tool that can simulate service loads and replicate user behaviours" for testing
* Chrono Service: "offers a programmatic API for distributed timers and alarms. For example, in the expiry of rental entitlements."
* Network Operation Center: Seems to be an internal tool for managing a shard/mesh and all its services and databases.
* Entity-Subscription Service: Seems to allow data to be transferred across two servers. Markers were converted for ship markers.
