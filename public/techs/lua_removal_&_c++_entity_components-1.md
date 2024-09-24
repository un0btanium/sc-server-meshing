# LUA Removal & C++ Entity Components
In order for Object Containers to be implemented, there were a few things that needed to be done first.

__Challenges:__

* loading and initializing objects from drive into memory takes a long time (>200ms, multiple game ticks long)
* to prevent long wait times, freezes and stuttering in the game, the loading and initialization process had to be executed separately and in parallel to the main thread which runs the game loop and thus game logic
* a lot of the game logic was written in the script language LUA which made it impossible to run the game logic multi-thread safe but is a requirement to run parts of the game code in parallel on other CPU cores
* dynamic objects (or also known under the term "entities") and their game logic was written in large, monolithic code classes which makes it difficult to maintain, expand and multi-thread the code

__Solution:__ Replace the old LUA game logic code with a new Entity Component architecture in C++ (speculated: not to be confused with an Entity Component System architecture) (may also be known as Item 2.0) (also not to be confused with ship components)

__Requirement for:__ Object Containers

__Goals:__

* introduce a multi-threadable Entity Component architecture in C++

__Approach:__

* the monolithic LUA code was converted into a C++ Entity Component where individual behaviors in the game are put into each their own components which could then be easily attributed to any entity
* in October 2019 they had between 300 to 400 individual components implemented and available
* each entity is then composed out of multiple components
* this new game logic written in C++ allows for safe multi-threaded code execution (game simulation, more about this in the Multithreaded Loading & Execution topic)
