# Subsumption AI
### Overview
__Challenges:__

* since Star Citizen universe plans to feature 9 times more NPCs than players as its population, with NPCs being able to perform most jobs and going about their daily lives, the game needs an extensive AI system to accomplish that

__Solution:__ Subsumption AI architecture

__Goals:__

* create a high-level, bottom-up, behavior-based, objective-oriented NPC system
* let NPCs traverse the game world and perform various actions by making decisions based on their surroundings

__Approach:__

* more complex tasks/behaviors are build out of multiple simpler sub-tasks/sub-behaviour, creating a "behavior tree"
* sub-behaviors are organized into a hierarchy of layers with each layer implementing a particular level of competence.
* Higher levels are able to subsume (integrate/combine) lower levels
* for example if the NPC requires an item then it would 1) search for the item 2) explore the area 3) walk around 4) avoid obstacles. In this case, the higher-level "explore the area" would utilize the lower-level competencies like "avoid obstacles".
* the NPC is able to adapt to new information while in the process of performing an action by constantly taking in information about the surroundings to then select an appropriate action in a bottom-up fashion
* each individual behavior does not make the NPC look intelligent, only the interaction of multiple behaviors within the environment does
* the Bartender NPCs are a result of this AI system, a first test for various behaviors by interacting with the game world, players and other NPCs
* with server meshing, the NPCs will have to be able to look into multiple servers to make realistic actions
* (speculation: all NPCs will run on their own game server that acts as a client and NPCs communicate back and forth with the game server similar to how player clients do it. this would allow them to look into multiple servers as well)
