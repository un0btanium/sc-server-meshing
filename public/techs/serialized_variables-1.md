# Serialized Variables
### Overview
Since Star Citizen is an online game it has to communicate the state of entities between the server and the clients to have the game world stay synchronized between multiple players.

__Challenges:__

* entities in games have values attributed to them (essentially their data) which can change on each game tick
* these values (also called variables) are in memory but they also have to be communicated over the network or persisted (e.g. saved on the drive as a save file or into a database)
* sending all values of all entities on every game tick (30 times a second) over the network would be a very high amount of data and would put a lot of load onto the bandwidth, servers and clients
* trying to setup networking on each value manually in the code as a developer can be error prone which results in desyncs and crashes
* the new Entity Component System makes this near impossible because an entity can have any number of components and thus each entity would be unique and had to be manually set up for networking (which kind of defeats the purpose of using components in the first place because they are supposed to be easily reusable with not much additional work)

__Solution:__ Serialized Variables or Serialized Variables API

__Requirement for:__ Object Containers, Save Files, Networking, Persistence, Persistent Entity Streaming, Serialized Variable Culling, EntityGraph/Item Cache

__Goals:__

* create an unified mechanism, an Application Programming Interface (API), which lets developers easily network variables and persist data

__Approach:__

* the API lets developers mark variables of entities as serializable/"networkable"
* not only can they set if a variable is serializable, but also if it needs to be newtorked on every game tick or only when the value changed
* this gives developers greater control of how a variable is supposed to be networked while also making it way less error prone to code
* let developers group variables to have them always be networked together (for performance reasons in case a specific group of variables always or very likely are changing together. If one variable in a group changed, then the check for the other variables in the group can be skipped)
* while the game is running, detect when a variable changed its state
* instead of sending all variables of all entities on each game tick, only send the variables that changed, therefore reducing send data and bandwidth
* bundle/wrap changed variables together and serialize them (basically turning them into a networking friendly format which can then be unserialized again on the receiving end). the same can be used to save/persist the entity data into a file or database
* used by Persistent Entity Streaming in Alpha 3.18 for persisting all serialized variables of all entities. Prior, only some of the serialized variables of some of the entities were persisted.
