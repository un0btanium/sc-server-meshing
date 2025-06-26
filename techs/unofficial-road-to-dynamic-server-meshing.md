# Unofficial Road to Dynamic Server Meshing - by unobtanium# Road to Dynamic Server Meshing - Introduction
### What to expect from this presentation:
This presentation is offering a centralized place about everything that is known about Star Citizen's Dynamic Server Meshing implementation. We will go over the the major and minor technologies that create the overall functionality of Dynamic Server Meshing. The official sources used are made available as well.

There is also an in-depth, step-by-step introductory topic as part of the Preamble. We go over some of the basic concepts in hardware, software and video games to build up a basic understanding of their inner workings and limitations. Of course, you are free to skip it and jump straight into the Object Container topic. But I will always recommend checking out the introductory topics first if you do have the time and interest.

__TLDR:__ This journey can be categorized and summarized on a high-level into the following five big milestones or functionalities:

* Engine Rework: The majority of the engine was replaced with new systems. StarEngine was born. Most of these changes released with Alpha 3.0 in 2017.
* (Area of) Interest Management System: Optimized the loading and networking aspects. Released in two parts as Object Container Streaming in 2018 and 2019.
* Persistence: Introduced saving and loading game state to/from a database. Also layed the foundational architecture for Server Meshing. Released in 2023.
* Distributed Simulation: Introduced by Server Meshing. Multiple game servers simulate different parts of the same game world. Alpha 4.0 Preview 2024.
* Architecture Scaleup: All code becomes highly scalable in a microservice architecture to allow many thousand of players to play in the same game world. 

![Image](/images/road_to_dynamic_server_meshing_introduction/image-00.png)


### Recap of major tech features releasing

* Alpha 2.6 - Jan 2017 - Object Containers (preview/feature parity)
* Alpha 3.0 - Dec 2017 - Object Containers, Entity Components, 64bit coordidnates, Zone System, planet tech, new render pipeline, and many more (Large Engine Rework) (24 -> 50 players per server)
* Alpha 3.3 - Nov 2018 - Client OCS
* Alpha 3.8 - Dec 2019 - Server OCS
* Alpha 3.8.2 - Feb 2020 - Long Term Persistence DB (later reworked into the Global DB), less wipes between patches
* Alpha 3.13/3.14 - Apr/Aug 2021 - Preparations for the Replication Layer in the game server code
* Alpha 3.15 - Nov 2021 - Release of the Global Database, Global Persistence and Physicalized Items and Inventory (uses RL to make backend DB calls)
* Alpha 3.17 - Apr 2022 - Entity State Networking through the Replication Layer (networking part of OCS moved into RL)
* Alpha 3.18 - Mar 2023 - Gen12 + EntityGraph Database + OC Loading via Replication Layer (+cache for Global DB queries in EntityGraph services, all of OCS in RL)
* Alpha 3.23 - May 2024 - Replication Layer moved out of the game server into its own server (Hybrid Service)
* Tech Channel Previews - 2024 - Static Server Meshing
* Alpha 3.24 - Aug 2024 - Replication Message Queue Refactor
* Alpha 4.0 - Dec 2024 - Static Server Meshing with Jumppoints and the Pyro solar system (~150 -> ~600 players per shard)
* Alpha 4.? - Work In Progress - Dynamic Server Meshing V1

### Visual Examples
Throughout this presentation, I tried to incorporate images to help visualize how these technologies work and what their purposes are.

So lets get started! The usual game level is three dimensional and therefore has three axis (x, y and z). We will leave out the z dimension and represent the level as a flat 2D area. We do this for simplicity reasons, but remember that all the presented technologies are actually operating in 3D. A first example of a level can be seen in the image below. It features two players (blue and red) inside the level.

On the following slides you find further explanations and visual representations of technical topics that will lay the foundation for all the subsequent technologies.

![Image](/images/road_to_dynamic_server_meshing_introduction/image-01.png)

### Quick Disclaimer before we start
Even though there was a great effort made to use official information and sources, be aware that some aspects of how these technologies work are deduced and therefore speculated. Whenever that was the case, I tried to make sure that it was noted as such, either in the slide title or in the text itself, so have a lookout for them. Therefore, the information presented here are my own understanding at this moment in time and are therefore subject to change. In the light of additional insights, the information in this presentation will be updated accordingly. Feel free to contribute with information that I may have missed.

If you feel like something is missing or you have a question or just want to say hello, feel free to notify me on Spectrum:

[https://robertsspaceindustries.com/spectrum/community/SC/forum/3/thread/road-to-dynamic-server-meshing-tech-overview-with-](https://robertsspaceindustries.com/spectrum/community/SC/forum/3/thread/road-to-dynamic-server-meshing-tech-overview-with-)# Road to Dynamic Server Meshing - Preamble
### How does the computer compute? Electrons, Transitors, Logic Gates
Let us start from the very bottom and build our way up:

Electrons move through conduit material.

This allows us to represent different states:

* 1 when electrons are moving,
* 0 when electrons are not moving.

We can then use tiny transistors to control this flow of electrons.

A transistor acts like a switch. But instead of manually switching it by hand - like we would a normal button switch - a transistor can be automatically controlled, by another electron flow. This allows state/data to change automatically.

When putting multiple transistors together in specific configurations, they create logic gates. And putting multiple logic gates together, one can perform binary math, comparisons, etc.


### Clock Cycles & Clock Speed
Since electrons require time to flow through the logic gates, to give them enough time to do so, we introduce a CPU clock. And we only check the resulting state at certain time intervals, meaning after each clock cycle.

Depending on the clock speed, modern CPUs can have billions of clock cycles each second. For example a CPU with a clock speed of 4.0 GHz can perform 4.000.000.000 clock cycles per second! That makes each clock cycle last 0.25 nanosecond (that's 0.00000000025 seconds). Light in a vacuum merely travels 7 centimeters in that time span (~2,8 inches).


### CPU Instructions
In each clock cycle, we can tell the CPU what to compute. Rather than having to tell the CPU where electrons need to flow, the CPU provides us with a defined set of instructions, a CPU instruction set, which abstracts all of that low-level hardware stuff away for us. In each clock cycle, we can have the CPU execute one such instruction.

Different instructions are responsible for different things: some instructions do math, others compare, move data around in memory or even alter the execution of our program.

CPU instructions are the interface between the hardware (our logic gates) and the software. Executing multiple CPU instructions in sequence (or even in parallel) allows us to perform more complex calculations and logic. Programs emerge.

__Note:__ These days, modern CPUs are further optimized and can sometimes perform multiple instructions in one clock cycle.

__Note:__ All software programs written in a programming language are translated into these CPU instructions at some point. The CPU does not know about any programming languages, except its instruction set. But since instructions are very very atomic operations, programming languages abstract these away to help us create complex programs easier and faster.


### Game Objects, Game State, Limitations
In video games, we can use these instructions to simulate a game world. This game world is directly made up of game objects. Updating each game object requires a certain amount of instructions to perform its simulation logic. For example, their change in position and orientation in the game world, as well as other state attributes of the object (e.g. a door might be in an open, close, opening or closing state).

But remember that there can only be one instruction executed in each clock cycle? And we "only" have e.g. 4.0GHz = 4.000.000.000 clock cycles (and thus instructions) per second available? This means we are limited in the amount of instructions per second. And this consequently means we are also limited in the number of game objects we can update and simulate. Although, the number of instructions a game object requires may vary, as it depends on the complexity of the game object.

So when adding more and more game objects, eventually, we won't have enough instructions available to update all of them in a timely manner. We are not allowed to skip the update of game objects as that would seemingly "freeze" parts of the game world. Instead, the next round of updates for ALL game objects is delayed. This is usually referred to as 'low tickrate' and will talk more about tickrate and the game loop later.


### Vertical & Horizontal Scaling, Large Game World
Of course to support more game objects, we could simply throw faster hardware at the problem. Use a CPU with 5.0GHz instead. Done! However, this only works up to a certain point. There are hard limits to hardware and better hardware becomes exponentially more expensive as well. Using better hardware is called vertical scaling.

Another and more promising option is horizontal scaling. Here, we simply use another CPU, an additional computer. By using multiple computers, each one with a CPU, connecting them via a network and having them exchange relevant data, they can work on a much larger workload.

If done right, as in having solved memory management, loading of data (memory is still limited resource on each machine, so as the game world grows not every game object needs to be loaded into memory), game simulation (a game object doesnt have to be simulated on all machines, but just one), networking (data is only send to computers that need it) and persistence (read and write data in databases for later use), then you have huge amounts of processing power at your finger tips. You could execute trillions of instructions across hundreds of computers/servers each second and simulate a large, game object-rich game world.

__Note:__ As is often the case, it is more complicated than this, but this is a good first introduction of what Dynamic Server Meshing is about.


### Overview of Computer Hardware and its Limitations
Some more technical background information first! A computer usually consists of 5 major parts:

* Drive (HDD/SSD/NVMe)
* Random Access Memory (RAM)
* Central Processing Unit (CPU)
* Graphics Processing Unit (GPU)
* Mainboard

![Image](/images/road_to_dynamic_server_meshing_preamble/image-01.png)

### Form of Data Storage
__Drive (HDD/SSD):__

Digital data can be persistently stored on drives. Data can be loaded from and saved to the drive. Data can be stored on mass, like terabytes of data on a single drive, since drives can be cheaply produced. Hard Disk Drives (HDDs) have mechanical parts and are therefore slower when it comes to read and write speeds. Solid State Drives (SSDs) are not mechanical and therefore data can be directly read and written, resulting in much faster read and write speed performances, but consequently are more expensive.

__Random Access Memory (RAM):__

Another way to store data is in the Random Access Memory. This type of memory performs even faster than SSDs when it comes to read and write speeds, however makes it even more expensive which is why RAM is usually in the ranges of a few gigabytes (4-32GB), not terabytes like drives are. However, data in RAM is volatile, meaning that if power is cut, the data stored in the RAM is lost, making RAM a great (because fast) storage while the computer is running and processing data, but useless as a long term storage device once the computer is turned off.

![Image](/images/road_to_dynamic_server_meshing_preamble/image-02.png)

### Computation and Communication
__Central Processing Unit (CPU):__

The CPU is responsible for the execution and monitoring of code instructions which allows the computer to be programmed by software for various purposes. The CPU transforms data from one state/form into another by making calculations and logic comparisons. While the CPU itself has a few MB of very fast memory (L1, L2 and L3 memory cache), the CPU still heavily utilizes the RAM to load and save data. The program that runs on the CPU determines which data is loaded from the drive into RAM (as well as saving data from the RAM onto the drive). This usually happens when the program is started, but data can also be loaded/streamed-in while it is running.

__Graphics Processing Unit (GPU):__

While the CPU is great at certain tasks like program execution, it usually is not great at rendering digital images fast. Another processing unit designed specifically for rendering graphics called the GPU allows for much faster and better results. It also has its own form of memory, the VRAM, to store textures and assets. The CPU usually tells the GPU via a rendering API what it should render.

__Mainboard:__

All these previous parts are connected with each other via the mainboard. All computer components communicate over connections, called the bus system (e.g. PCI and SATA). They basically are data highways from one component to another, the flow of data being controlled by the CPU.

![Image](/images/road_to_dynamic_server_meshing_preamble/image-03.png)

### Doing math and performing logic
So what do all of these components do? It comes down to executing code: commands which instruct the computer to perform math and logic on the data in memory. These code instructions alter the data, turning that data from one state into another state. And depending on the processor architecture, cores and clock speed (e.g. 4.8GHz) there can be multiple billion instructions executed per second. Those results are then send over a network and/or used to create an image on our monitor screens.

In the example on the right, we have four instructions that load two values from memory (from the two memory addresses 128 and 256) then perform addition on them and the result is stored back into memory at memory address 128 (essentially overwriting the previous value that was stored there). In the context of a videogame, these could be the position x and the velocity vx of our player character. So the computer calculated our character's next position in the level. More on this "Game Update Loop" chapter in this Introduction.

1) load r1, 128

2) load r2, 256

3) add r3, r1, r2

4) store r1, 128


### Hardware Limitations
In general, all computer components have their own limitations. Memory (drives and RAM) are limited by how much maximum data capacity they have as well as how fast they can read and write data (and if they are volatile or not). Meanwhile, processing units (CPUs and GPUs) are mostly about how many code instructions they can execute each second, as well as how fast they are able to access the data from the memory devices.

With these limitations all software is created, games included. CIG set out to create a large universe with thousands of players, NPCs and other entities which all require to be in memory and need to be computed by the CPU in the game loop (and rendered on the GPU). Not even the most powerful computer will be capable of providing that much memory and computational power on its own.

Therefore, the load has to be distributed onto multiple computers/CPUs and connected over a network, to let the computers communicate and exchange only the currently relevant data with each other. Mainly the game servers need this functionality while the players only need to connect to a small amount of game servers at any given point in time and load and compute only the entities close to them. Such a system is generally called a Server Mesh, because multiple servers are being meshed together over a network (local or over the internet). That makes multiple computers act as one large one with a lot of memory and lots of computation power. This is the system Star Citizen plans to utilize to create its vast and rich universe.


### Networking - The Client-Server Architecture
Since Star Citizen is a multiplayer online game with many players playing in the same game world, the data has to be shared and communicated between the players over the internet. Star Citizen uses the common client-server architecture to accomplish this.

In such an architecture, you usually have a computer that acts as the server and other computers which act as the clients. All computers are connected over a network (e.g. the internet). The clients can connect themselves to the server and then the server and the clients can exchange information over the network between each other. Clients don't establish connections between each other, and instead all clients are connected to the server. The server distributes/relays the information from one client to the other clients.

In the case of Star Citizen, each player starts their game and their game client will establish a connection to a game server. The game server runs just another instance of the game, just like the player game clients. However, the server instance is special because it does not actually act as a player. The server simulates the game world while listening to the incoming actions from the player clients, then sends the resulting changes back to all clients which will then in turn update their own game world accordingly.

Since communication between multiple computers over a network always introduces latency between the sending and receiving of data packages, the state of the game world will always be slightly different on each player client and the server. To ensure that the game provides a reliable gameplay experience for all players, the server instance is deemed to be the "ground truth" about the state of the game world. Basically the server has the authority of the game state. That means that the player clients will always trust the data that comes from the server over its own current world state. Since the server always simulates the game world and thus

validates the player actions, this guarantees that all clients will stay synchronized with the server and that

the game world a player sees wont deviate drastically from what other players see on their screens.

![Image](/images/road_to_dynamic_server_meshing_preamble/image-04.png)

### Game Update Loop
Games come to life thanks to the game update loop. It simulates the game world by updating all entities multiple times a second. Doing one cycle in the loop is considered to be one game tick and many games execute around 30 game ticks per second.

At the start of each game tick, the game processes the input done by the player. For multiplayer games it also checks for any network updates that were received. The game world is then simulated by executing the update logic of entity (dynamic game objects) in the game world (more on this in the next slides). Once that is done, the game may send the changes made over the network (to a server or client). On the game client, it then triggers the graphics renderer to have it prepare and render a new frame which will then be displayed on the player's monitor.

Server Meshing is about the Simulation and Networking parts of the game update loop to having multiple game servers work together to simulate the same game world without being noticeable for the players.


### Game Update Loop - Game Simulation 1/4
For the state of each entity, there is an area of memory reserved. Each location in memory can be addressed by a unique "identifier": its memory address. Therefore, memory can be thought of as one long tape where data/values/state can be read from, changes made and written back to.

On each game tick, the state of the entities are updated when the game is simulated. For example, the position of the entity (e.g. a player or spaceship) in the game world.

In the image on the right we have a player positioned at coordinate x=10 and y=25. Those two values exist at the memory addresses 192 and 256.

![Image](/images/road_to_dynamic_server_meshing_preamble/image-05.png)

### Game Update Loop - Game Simulation 2/4
On each game tick when simulating, these values are read and then incremented by the current velocity of the player, then saved back in the same position in memory.

In our example on the right, in the first game tick, the x position was increased by 5 and the player moved a short distance in the game world.

A game tick can be thought of like one "move" when playing a board game. Just that all object in the game world receives their move in one game tick. So all objects make their move at once and, ideally, 30 times per second.

![Image](/images/road_to_dynamic_server_meshing_preamble/image-06.png)

### Game Update Loop - Game Simulation 3/4
In the second game tick, both x and y values were increased by 5 and the player moved a small distance diagonally.

![Image](/images/road_to_dynamic_server_meshing_preamble/image-07.png)

### Game Update Loop - Game Simulation 4/4
Therefore, on each game tick, all entities only ever teleport from one position to the next. Smooth motion emerges because they are updated and teleported multiple times a second (~30 times). This is how the game world is simulated on the CPU.

These values (and/or player inputs/actions) may be send over a network (to either the clients or the server) as well as used to render an image on the player client's GPU.

In terms of rendering, there are a few tricks like Interpolation to have smooth motion of entities when the frame rate is higher than the update tick rate of the game loop. E.g. with 30 game ticks/sec but 60fps, every second position of an entity is estimated on the current and previous position to ensure smooth motion on screen.

__TODO:__ collision checks between game objects

![Image](/images/road_to_dynamic_server_meshing_preamble/image-08.png)

### Game Update Loop - Networking Entity State 1/3
Whenever there was a change in the game world - that is after the simulation - the game server prepares a data packet with these changes. In our case, it uses the x and y coordinates.

![Image](/images/road_to_dynamic_server_meshing_preamble/image-09.png)

### Game Update Loop - Networking Entity State 2/3
This data packet is then send over the network to the clients.

![Image](/images/road_to_dynamic_server_meshing_preamble/image-10.png)

### Game Update Loop - Networking Entity State 3/3
Each client receives the data packet, opens it and saves it into its memory. Now the client would be up to date with the server again and reflect the current state of the game world (e.g. by rendering a frame on the screen).

Although in the image, the coordinate values were saved at the same memory address on the client, in a real application they usually are in different locations in memory. Each computer manages their own memory and determines for itself to which memory addresses the values have to be saved. This just covers the basic networking logic. There are further optimizations (such as client-side prediction and server reconciliation) which is generally know as netcode. However, we wont go into too much detail on such optimizations over the course of this presentation. This current knowledge on networking game state will suffice for now.

![Image](/images/road_to_dynamic_server_meshing_preamble/image-11.png)

### Game Update Loop
However, one important note before we continue: In most online games, the client usually simulates the game world just like the server does. This is done because exchanging data via a network introduces latency. While waiting for the server network updates to come back, the client will use information from the previous entity state updates send from the server (essentially the entities' last known actions) to simulate and therefore predict the entities behavior. Later, the network update from the server will be used to ensure its correctness and correct the client's entities state if necessary. This solution helps with creating a smoother experience for the client while benefiting from the server verification at the same time.

![Image](/images/road_to_dynamic_server_meshing_preamble/image-12.png)

### Frame Rate and Game Ticks - Difference between Rendering (GPU) and the Game Loop (CPU)
One important topic we should discuss as well is the difference between Frame Rate (Rendering on the GPU) and Game Ticks (Game Simulation and Networking on the CPU).

Every game has a game loop in its code to simulate that time has passed in the game world. In each game loop cycle, called a "game tick", all/some objects in the game world are being updated as well as the inputs of the players handled to have an effects in the game world. In many games, the game loop is set to 30 ticks per second (every 33.3 milliseconds one tick), in some highly competitive games up to 64 and even 128 ticks per second to allow for the reaction time of players to matter more. The game tick rate is usually independent from the frame rate.

The frame rate is usually determined by how many images/frames the render engine and the GPU can create within one second. This is usually determined by a lot of factors, like what the renderer and GPU are capable of, how many objects are on screen, in which ways the objects are being rendered, etc. At 24+ frames per second (fps), the brain is tricked into seeing motion. In recent years, especially in the competitive gaming scenes, monitor screens allow for 144fps and more. Of course, the GPU still has to be capable of providing these high frame amounts first before they can be displayed.

The game loop is executed by the CPU, not the GPU. That is because the game code and game logic is executed on the CPU. If there was no game loop, then no changes would happen in the game, and the GPU would only ever render the same image/frame with no changes over and over again. Only because of the game loop, it is made possible that objects change state in the game world. The CPU periodically sends the current information of the objects of the game world to the GPU to have it create a new image. This is done by the renderer, also running on the CPU, which optimizes the scene data before it is send to the GPU. There are a few tricks like Interpolation to have smooth motion of objects at high frame rates even if the game loop only runs at 30 ticks per second.

Since the game servers only need to simulated the game world, they just run the game loop without rendering the game (which actually frees up some CPU load because the CPU does not have to tell the GPU what it is supposed to render). Thus there usually is no GPU installed in the computer configuration of game servers.

__Note:__ Sometimes the game tick rate on the server is referred to as frame rate as well. Frame here refers to a frame of time or execution, and not an image.


### Objects and Entities (and Components)
One last topic before we can finally start our journey toward Dynamic Server Meshing is the difference between objects, entities and components in the game.

The game world is usually created out of static objects (brushes). These objects are usually floors, walls, ceilings, stairs, planet surface, etc. These static objects are pure geometry and do not have any special behavior attached to them (except maybe a separate hitbox for collision checks) and therefore do not have to be updated in the update loop at all. Thus, they are very cheap objects CPU computation-wise and merely need to be rendered on the GPU.

However, games usually feature dynamic objects as well, like players, NPCs, ships, other vehicles, doors, etc. Essentially everything that moves, interacts or has behaviors are considered dynamic objects. They are usually referred to as entities (entity in singular) and are the ones which are updated in the game loop on the CPU.

Based on the number of game tick per second the game runs on, the CPU only has a few milliseconds to go through all entities that require an update and update them. Star Citizen has a tick rate of 30 and therefore 33 milliseconds (ms) computation time available for each game tick. Usually a modern computer can handle a few thousand entities depending on the complexity of those entities. When there are too many entities or too many complex entities being updated, then the game starts to slow down which can have a noticeable impact on the player experience. Therefore, the goal is to keep the entity computation low enough for a smooth experience by staying under those 33ms for each game tick.

As we will see later, Star Citizen reworked its entity system to an Entity Component architecture and splits each individual behavior in the game into its own component which then can be attributed to any entity. Therefore, it matters how many components are being updated in the game update loop, not necessarily the amount of entities.

# Object Container

![Image](/images/milestones/milestone-01.png)

### Introduction
Our multi-step journey to Dynamic Server Meshing begins with the creation of Object Containers. For which there were many parts of the engine changed, making this more of an overview of the whole engine rework.

__Challenges:__

* traditional game levels consist of a list of objects (static and dynamic) which are loaded all on level start behind a loading screen
* to eventually be able to create a seamless universe with no loading screens and thousand of players, we can't load all objects into our memory all at once since the large amount of data would exceed our memory capacity

__Solution:__ Object Containers, a major part of the whole Engine Rework

__Goals:__

* instead of designing a level, introduce the idea of level building blocks called Object Containers which make up individual parts of the level from which the entire level is made out of
* this will later allow parts of the level to be loaded and unloaded into/from the level at anytime while playing
* this requires the functionality to stream objects in and out of memory, even after the initial process of loading the level finished
* the current system does not allow for such functionality, so we need to implement a unified system which will allow objects to be loaded at any time
* it will then be used to build upon toward the final Server Meshing implementation where different parts of the level is going to be computed by different game servers.

__Approach:__

* put all unique objects referencing their resources (like geometry, assets and entity type) into their own Object Containers
* allow Object Containers to reference and have other Object Containers as children so that the final level emerges out of many nested Object Containers
* rework the existing levels to use the Object Containers and create all future content with Object Containers which requires changes to the engine editor
* on level start, load the level via the Object Containers. There does not exist any logic yet that loads Object Containers while playing and will be the functionality later introduced by Object Container Streaming which loads/unloads objects at any time
* Object Containers themselves were first introduced in Alpha 2.6.1 (Feb 2017) but many of the other features (Megamap, 64bit coordinates, Entity Components, etc.) made its debut with Alpha 3.0 (December 2017)

### Example
In the visual example on the left, we have loaded three players into the level. The red and green players are near each other on the same planet while the blue player is on a different planet far away. However, to avoid visual clutter, the planets, ships and other objects were left out of the image and we only show the connected players. We are going to revisit this example in the upcoming major technologies again.

Underneath, we also see a visual representation of the load on the individual computer components. The load on the CPU (blue) and GPU (red), how much RAM (orange) is in use, which part of the drive we loaded into memory (grey area). In this case the data of all objects were loaded from drive into memory, the load of CPU and GPU and memory occupied is quite high. (In the context of Server Meshing, the GPU is not as relevant as the CPU and memory.)

With the level split into different building blocks (Object Containers), the game could load and unload parts of the level at anytime. Therefore, we would only ever need to load the parts of the level into memory which are near and visible to the player (like a few kilometer sphere around the player) instead of having to load the entire level from drive into memory. This allows the game to keep memory consumption low enough to not exceed the maximum memory capacity.

However, the functionality to stream objects from the drive into memory after the initial level load wasn't actually introduced yet with the release of the Object Containers. The player client and game server still had to load all objects of the level at its initial load because there was no logic yet that would tell client and server which objects it should load or unload. The functionality for streaming objects in and out of a level at any time became only possible with the introduction of Object Container Streaming which we will talk more about later.

![Image](/images/object_container/image-01.png)

### The Implementation 1/3
Object Containers are wrappers for object types. A container acts as a template from which one or multiple instances (entity) of the same object type can be created. An entity might a player character, coffee cup, a ship or even planets and solar systems. Each object type (and thus Object Container) might have a unique identifier (either a name or a number) with which it can be referred. Each container has a list of the resources it uses, e.g. models, geometry, textures, zones and entity components.

Some Object Containers might represent atomic objects. Others Object Container may represent an entire or partial level. This is done because Object Container can reference of other Object Containers. Thus, Object Containers can be nested. A tree structure of Object Containers is created. For example the Stanton system would be a Object Container which references the Stanton star and its four planetary systems as its child Object Containers. The landing zone Area 18 would be referenced from the ArcCorp planet container, and so on.

![Image](/images/object_container/image-02.png)

### The Implementation 2/3
With Object Containers the level is now split into individual building blocks. Artists and developers do not develop individual levels anymore, but instead individual objects or parts of a level. Those can then be reused anywhere in the level and be part of other Object Containers. Therefore, the final level is made up of nested Object Containers from which game objects (entities) are spawned.

An artist making a change to an object container, changes all entities that originate from that object container in all places in the level. For example, a chair design used all across a landing zone. Instead of having to make changes to all hundred chairs individually, the artists just have to make the change once to the chair Object Container. This makes it easy to make changes, rework and update existing objects without having to update every single object individually. Just the Object Container has to be altered.

![Image](/images/object_container/image-03.png)

### The Implementation 3/3
When an object is loaded into the level, either on initial level load or later while playing, the Object Container is loaded into memory. Then a new object is created from the Object Container. This is done by allocating the required space in memory to later hold the object's state (like position). The resources that are listed in the container, like textures and geometry, are loaded into memory into the MegaMap and/or into the memory of the GPU.

The MegaMap consists of various memory managers which check, if a resource was already loaded by other objects. If that is the case then the already loaded resource is simply reused rather than loading it again which would waste memory space by introducing duplicates. The object is initialized with its values and positioned into the level. Most of these values are going to be loaded from a save file but later are going to be loaded out of a database. An Object Container can consist of multiple child Object Containers which will be loaded and initialized and relatively positioned to its parent object into the level (for example, the clothes a character wears, the gun that is attached to the character and the bullets that are in its magazine and bullet chamber).

Once loading and initializing is done, and the object is dynamic - meaning it has behavior and can be interacted with - then this entity is ready to be computed by the CPU in the game update loop, thus state changes and stuff happens in the game world, e.g. a player or NPC can walk around, a ship can fly, a terminal can be accessed, a ship spawned, a wall can be run into, etc.

![Image](/images/object_container/image-04.png)

### Entity Components
Alongside the development of Object Containers, CIG also reworked the entire simulation code of the engine. They rewrote the code by splitting and reusing code pieces across multiple different object types.

An entity is not just a whole thing. It consists of many small behaviors and interactions, like physics, player health, movement input, etc. Each of these behaviors were put into their own Component. And thus there exists a PhysicsComponent, a HealthComponent, a InputComponent, etc. When a new entity is spawned, then the components of that entity are initialized and memory reserved to hold their state. The entity is therefore a composition of components.

In the code, these components can then be used on different entities, speeding up development and reducing bugs by not having to write or copy the same code over and over again into different object types. For example, player characters, ships and other items can all make use of the same PhysicsComponent, to experience gravity and other forces as well as collide and bounce off each other. Of course, depending on the behavior of the object, it will be attributed different Components. For example, not all entities need the InputComponent, only the player character.

![Image](/images/object_container/image-05.png)
![Image](/images/object_container/image-06.png)

### Zone System
Additionally, the new Zone System (speculated: a custom hybrid between a space partitioning data structure and a scene graph) splits the game world into areas. All objects inside such an area are grouped together. For example, a zone can be a spaceship. All objects inside that spaceship are grouped, thus being part of that zone. When the spaceship moves, its zone is moved as well, thus moving all objects inside of the spaceship with it. This is made performant by giving each zone its own coordinate system and objects inside are placed and moved relative to the zone center coordinate instead of the game world level center coordinate. And thus, the positions of the objects inside do not need to be updated when the ship moves.

This system replaces the old Octree partitioning system. Octrees split the game world in cubic, immovable chunks. Each cube can be split into 8 smaller sub-cubes. Those sub-cubes can be split into 8 more cubes again. Rinse and repeat. In memory, a tree structure emerges which can be traversed by all sorts of algorithms. The image shows the difference between Octrees and Zones. Be aware that our level example is 2D, thus we are actually showing Quadtrees (the 2D version of the 3D Octrees, using squares instead of cubes thus splitting a square into 4 sub-squares).

With the 64bit conversion, the levels have become extremely large. The Zone System splits the game world much more efficiently, as it is able to concentrate on areas where lots of objects and activity are, instead of splitting empty space into hundreds of empty cubes which creates larger tree data structures which requires more memory and takes longer to traverse.

The Zone System is used for optimizing rendering, physics collisions as well as for networking entity updates and loading/streaming objects in Object Container Streaming. The room atmosphere and physics grid systems are (most likely) directly build upon the zone system as well.

![Image](/images/object_container/image-07.png)
![Image](/images/object_container/image-08.png)

### Serialized Variables (API)
Optimization was done on the networking to reduce bandwidth. On each game tick the server has to send the state of entities to the player clients. With the high amount of data of entities in Star Citizen, this will result in a lot of data and thus bandwidth. Therefore, CIG implemented an system which detects any entity state changes. It then only sends those changed values across the network instead of the entire state of the entity, which would include unchanged values as well. This network optimization made it possible to reduce the bandwidth up to 80% for certain Entity Components.

![Image](/images/object_container/image-09.png)
# Client Object Container Streaming

![Image](/images/milestones/milestone-02.png)

### Overview
With Object Containers it is now possible to split a level into separate game areas and load them into a level anytime. However, that functionality cant be utilized yet. Client Object Container Streaming (sometimes Client Side OCS or CSOCS or COCS) sets out to change that.

__Challenges:__

* by increasing the amount of objects in the level, more and more system memory is required
* by adding more entities into the level, the load on the CPU for entity computation each game tick increases
* the CPU of the client has to keep entities in sync with the server by updating its state
* too many entities computed currently results in not enough CPU load available to help render the game
* frame rate and performance on the client drops

__Solution:__ Client Object Container Streaming, an intermediate step toward complete Object Container Streaming, also sometimes more generally known as (Area of) Interest Management

__Goals:__

* reduce the memory requirements on the player client
* reduce the load on the CPU on the player client
* allow for more objects and entities to be added into the level on the server (e.g. more planets, locations and players)

__Approach:__

* reduce memory usage by only loading the nearby/visible objects of the level around the player
* dynamically stream Object Containers in and out of the level while the player is traveling across the level or entities (like other players and their ships) approaching/leaving the player
* the server notifies the player clients whenever the player clients should load objects
* streaming entities in and out reduces the amount of entities that have to be computed by the client CPU
* for far away entities, the server stops/skips network updates based on the entity's distance to the player to save client CPU usage (such features are generally called Interest Management, limiting the necessary information sent/simulated by that what interests the client)

### Initial Situation
Without Client Object Container Streaming, all clients and the server have the entire level loaded. This means that all object have to be loaded from drive into memory on level start or when connecting to the server. The server CPU computes all objects/entities and sends state updates to the clients via messages over the network/internet. This leads to CPU usage on the player client being quite high because it receives information about all objects in the level as well as the CPU having to help prepare the next frame to be rendered as well.

The client is overloaded with too much information and the CPU cant help render the game as much anymore and even the frame rate starts to suffer. The server does not have that additional load since no graphics are being rendered on it, only the entities updated on each game tick.

In the picture on the left, at the top, we can see that the entire level is loaded (white area is loaded). CPU (blue) and memory usage (orange) are quite high since all entities are loaded from drive into memory and being computed on the CPU.

![Image](/images/client_object_container_streaming/image-01.png)

### The Solution 1/2
With Client Object Container Streaming, clients do not have to load the entire level anymore, only the nearby objects around them. This may be another player standing right in front of the player, the enemy space ship the player is shooting at, the space station in orbit, or the moon far away in the sky. Which objects are being loaded is determined by how far away and how large the object is, so that the moon in the sky will be computed and displayed but not the small players which are on that far away moon.

In the picture on the left, we now see that for each player client only the area around that player is loaded. The remaining level is not loaded which is represented with the greyed out areas. We also see the expected reduction in memory usage (orange) and the load on the CPU (blue) since we have to load less data into memory and need to update less entities on each game tick.

__(Note:__ All percentages are purely for visualization, not real world performance statistics!)

![Image](/images/client_object_container_streaming/image-02.png)

### The Solution 2/2
When a player moves around in the level, object containers behind/far away from the player can be being unloaded while object containers that are about to come 'into view in front' of the player are being loaded into memory (e.g other players, ships and items) (Note: "view" refers to objects all around the player, not just the objects directly in front where the player is currently looking at, since the players view can change rapidly, faster than data can be loaded from drive into RAM.) This requires communication between the client and the server where the server notifies the client to load objects via Object Container into memory.

In the example on the left, the blue player (Client A) moved around in the level toward the red player. As the red player came into view, he was loaded into memory on the blue players computer and started receiving updates from the server to stay in sync. The same for the red player who loaded the blue player into memory and started computing him each tick.

![Image](/images/client_object_container_streaming/image-03.png)

### Multiple systems working together
Since the client does not need to know about all entities that are on the server anymore, Client OCS and its functionality was initially referred to under the name Network Bind Culling (or Network LOD). Essentially the data on the client is culled via the network by the server. However, it seems as if Network Bind Culling is just one part of many that brought us the final Client OCS functionality. Here is a quick summary:

__Serialized Variables:__ Introduce network update policies to entities and their variables, e.g. a variable being constantly networked on each game tick or only when its state changed to reduce and optimize network bandwidth.

Entity Component Update Scheduler: Provides information of how far away an object is to the player. It supported the functionality of starting and stopping (essentially skipping) network updates of entities that are too far away from *all* players.

__Serialized Variable Culling:__ The Entity Component Update Scheduler stopped networking entities to the clients that were too far away from all players, but all clients still were send network updates of all entities around ALL players on that server, no matter how far apart the players were from each other. Serialized Variable Culling changed that: The server now only sends each client the updates of entities which are near that specific player, not all players anymore.

__Network Bind Culling:__ The previous features were only about limiting network updates, all entities were still loaded on the client even if they did not receive network updates anymore. This was changed with Network Bind Culling. This feature added the functionality for the server to tell the client when to load objects on each client from/into memory. This makes use of the Object Containers.

With Client OCS, a player client is able to load and stay in sync with the entities on the server which are relevant to that specific client. Therefore, information on the client has been reduced, selected based on the object size and distance to the player in the level. More features, like loading these objects into memory in the background in other CPU threads as well as the Serialized Variables feature for efficient networking, accumulated in the final Client OCS feature.


### The streaming bubble
The bubble doesnt actually exist as such. We are just using it to visualize more easily that stuff is loaded around the player. But in reality, whats loaded are the individual game objects.

(On a similar note, the actual (empty) space of a level doesnt need to be loaded, as 'nothingness' does not have to be represented as a game object in memory).

But we might think of the bubble as the spatial query which determines which game objects to load. This makes use of the 3D 64bit geohash "StarHash" and a Radix Tree which are suited to perform such spatial queries. It factors in the distance between each game object and player, as well as the size of each object.

Therefore far away and/or small objects might not be loaded because those wouldnt be visible to the player anytime soon. Likewise, objects that are really large - like moons or planets -might still be loaded from far away. With Object Containers being nested, not all contents of a location need to be loaded all at once either. While the planet ArcCorp might be loaded already, the Area 18 city or parts of its interior might not be loaded yet as it is still too small. In a similar fashion, these small objects are unloaded first as well when a player departs and moves away from such location.

![Image](/images/client_object_container_streaming/image-04.png)

### Client OCS in-depth 1/5
So how does the client load objects?

Afterall, the client cant simply use a level save file anymore to load entities, since now those initially only exists in the game server's memory. The client only has a small section of the game world loaded, and everything that isn't loaded is therefore unknown to the client. Thus, it has to be the game server that has to let the client know which objects to load.

In our case, the red player client does not know about the blue player yet, because the blue player is on the other side of the level and too far away still. But, the blue player is traveling toward the red player's position. So lets see how this plays out.

![Image](/images/client_object_container_streaming/image-05.png)

### Client OCS in-depth 2/5
Once an object moves close enough to a player, the server notices this and considers it relevant for that specific player client. Again, this also takes into account the size of the object, not just the distance to the player. Once identified, the server makes use of Object Containers to communicate it to the client.

Both the client and the server have the same list of Object Containers and each Object Container has the same identifier. In our example, player characters have the id #001. This allows the server to sends a network packet to our red client, which contains the Object Container ID #001.

This reduces the network bandwidth required while playing the game. Sending only the identifier of an Object Container means that the server does not have to send the actual Object Container itself nor any resources associated with the Object Container. Resources like textures, geometry, sounds, etc. are all downloaded onto the player's drive while downloading and patching the game. That is also the time when the list of Object Containers is downloaded.

![Image](/images/client_object_container_streaming/image-06.png)

### Client OCS in-depth 3/5
Once the player client receives the network packet, it will use the ID to look up the Object Container its own list of Object Containers. In this case, it will find the player character object. This Object Container acts as a blueprint to spawn new player characters from. So all player characters are spawned from the same Object Container.

However, not all players are the same, for example the player wears have different armor and holds a coffe cup. So the server might already sends additional information and more Object Container IDs within the same network packet already.

Even tho the blue player character is now loaded, the character might not be shown and simulated in the game world yet. For now, it just resides somewhere in memory on the red client's computer.

Of course, in our example, this same process is also happening for the client of the blue player. It needs to load the red player into its memory and is notified in the same way. However, we don't show the blue client in the example.

![Image](/images/client_object_container_streaming/image-07.png)

### Client OCS in-depth 4/5
Once the blue player moves even closer to the red player, the server notices this again. This time it sends the entire entity state of the blue player as a so called Entity Snapshot to the client.

When the red client receives it, it is used to properly position and initialize the player character. At this point, both server and client have synced up the blue character, as both have the same state in memory.

__Note:__ The player client loads and receives state updates prior to when they would start moving into actual view on screen.

![Image](/images/client_object_container_streaming/image-08.png)

### Client OCS in-depth 5/5
Since the Entity Snapshot syncs up the entity, the game server can send - on the next and subsequent game ticks - the entity state updates to the client, like it would have done in any traditional client-server architecture without OCS.

This continues until one of the player exits the game or moves far away again and the object becomes irrelevant. Then the server stops sending entity state updates to reduce the CPU load and bandwidth. The server decides when to stop and resume networking for each individual client based on the network policies (like distance, object size and other more situational rule sets).

Even if network updates were stopped once, entities can move in and out of 'networking distance' again multiple times. If the object didn't move too far away yet, then it might still reside in memory and doesn't have to be loaded again. A new Entity Snapshot is being send each time networking starts up again. But once an object is continuously networked the server only sends values which change based on the networking policies of the Serialized Variables software system.

![Image](/images/client_object_container_streaming/image-09.png)

### Summary
Client OCS now provides each client a partial view into the entire level on the server. The server has to lift the majority of the work by letting each client know which objects to load from its drive into memory so that the client CPU can start receiving the entity updates from the server and have entities stay in sync with the equivalent entity on the server. (Speculation: It is likely that the client itself decides when to unload objects from memory based on its available RAM capacity.) The server figures out when a client needs to load and receive state updates. Whenever that is the case, the server communicates that to the client. Therefore, Client OCS put some additional load onto the server, to allow for a significant computation reduction and performance on the client.

This technology allowed CIG to improve performance for players significantly, because the amount of entities that had to be computed on the client was drastically reduced, thus the computation time for each game tick reduced. That also left the CPU with more time to help render more frames. The addition of multi-threaded loading and unloading of entities also reduced a ton of freezes and stutters. Client OCS allowed more objects like planets and their locations to be added into the Stanton solar system level (and more solar systems in general) without putting more load onto the player client.

# Server Object Container Streaming

![Image](/images/milestones/milestone-02.png)

### Overview
With Client Object Container Streaming (COCS) we have improved the performance and memory requirements on the client side which improved the performance for the players noticeably. On the server, we can now increase the level size by adding more objects into the level, for example more areas like planets and locations without effecting the performance on the client as much as it did.

__Challenges:__

* the server still has to compute all entities and have all Object Containers loaded in memory
* while adding more objects into the level does not effect the player client as much anymore, the server still has to load all and compute most of them, no matter if players are nearby or not
* adding more and more objects into the level starts to exceed the server CPU and memory load which prevents us to create even larger levels with more content

__Solution:__ Server Object Container Streaming (sometimes Server Side OCS or SSOCS or SOCS), Interest Management for the game server

__Goals:__

* Reduce the memory requirements on the server.
* Reduce the load on the CPU on the server.
* This is going to help performance later under Server Meshing, where multiple servers will simulate a game world, but don't have to load the entire game world and instead only their little corner section of it.

__Approach:__

* Dynamically stream game objects in and out of the level on the server while players are moving around
* Serialize entities via Serialized Variables and stream/save/load entity data into and out of a database (pCache, later iCache) to free up memory, thus the server only has a portion of the entire database loaded
* Thus only load the level areas where players are nearby to reduce the memory consumption
* With certain areas of the level not loaded, the amount of entities that have to be computed on the CPU is being reduced and performance does not deteriorate on the server anymore

### Example - Initial Situation
With the implementation of Client OCS, we have reduced the memory and CPU load for the clients. However, the server still has to have all areas loaded into memory and all entities in those areas (like NPCs and players) computed each game tick, whether there are players in that area or not. That uses valuable memory and CPU computation time. This prevented the addition of new planets and locations since the server would exceed its memory capacity and CPU load.

The idea to solve this is simple: Implement the same Object Container Streaming functionality for the server as well. That means: Only load those areas with players and unload all areas with no players.

The difficulty here is, that the server defines the "ground truth", the universal state, for all the clients. Therefore, the server has to make sure that it has loaded all objects around players itself first, before being able to load and communicate state changes of those objects on/to the clients.

![Image](/images/server_object_container_streaming/image-01.png)

### Example - The Solution
With Server OCS being implemented, the server too now only loads the areas with players in them. When players move around the level, the server dynamically loads the level in front of the player and unloads the level behind the player (if there are no other players in that area already/anymore, that is). CPU and memory loads are now reduced on the server, allowing more objects to be added into the level again. The server sends periodic queries to a database to check if objects around players are about to come into view. If that is the case the server will lookup the Object Container identifier of those objects and load the object into its memory.

This technology allowed CIG to add more planets and moons of the Stanton system into the level which was previously impossible without exceeding the server resources.

Unfortunately, Server OCS did not increase the player count of servers. Most computation intensive areas (like landing zones) were always populated by players and thus are usually never unloaded. Load was still high on the servers. Therefore, CIG had to decide between more players or more content. They went with more content.

![Image](/images/server_object_container_streaming/image-02.png)

### Summary and Future Features 1/2
While Client OCS allowed clients to have a partial view into the level of the server, Server OCS now allows the server to have a partial view into the entire level. The entire level is now stored in a database on the server drive (and later into the large database at first pCache, then the new horizontally scalable EntityGraph).

The server now does not have to load the entire level anymore, only select parts of it. Thus, even if the level size increases into hundreds of GBs (or even terabytes) in the database, it only needs to load a couple GB of it into memory at all times.

Additionally, Server OCS will also be used for the Squadron 42 singleplayer game to load and unload objects on demand. A local database (EntityGraph) running on our computer along side the game, will act as the game save files by serializing the game objects from memory onto the drive and then loading it again from the drive into memory via Server OCS.


### Summary and Future Features 2/2
With the first version of Server OCS, whenever an area of a level is unloaded onto the drive/database, the entities in those areas wont be computed in the game loop anymore, thus no changes are occurring. Essentially, that specific section of the world is frozen in time until a player moves back into that area again. That is not ideal in a simulated, immersive and economy driven universe.

To solve this, in the future, another server/service will take those unloaded areas and quickly simulate the time that has passed. This way, the computation resources required are greatly reduced by abstracting the simulation to a minimum. The universe would still appear alive. For example, NPCs who are busy repairing a ship wont have to be simulated running around and doing their job if no player is around to witness them doing it, only the ship hull values have to be increased in the database in the background. When a player enters the area again, the ship will be in a more repaired state compared to when the player left the area. Meanwhile, the NPCs are loaded back into the area again as if they were busy the entire time, even thought they did not actually exist to work on repairing the ship. This way, the entire universe will always feel alive, even thought most of the universe won't even be actively loaded and computed on the game servers themselves. This feature heavily relies on Global Persistence to be completed, since values have to be update in the database, then accessed and loaded into memory by the game servers. Simulating the game world on a higher abstraction level is also going to be the main functionality of the StarSim Economy Simualtor.

Another major future feature of Server OCS relying on Full Persistence as well will be Server Recovery. Once all states of all entities are continuously persisted into a database it becomes possible to recover a server after a crash. If a crash happens, a new server can be started in its place, the database provides the information about the entities that were present on the server at the time of the crash, load those entities back into memory via Server OCS and connect the player clients back to the server again. Therefore, in case of a server crash, players would only have to experience a couple seconds of interruption and barely any loss of progress in the game before being able to continue playing the game again where they left off.

# Persistent Entity Streaming

![Image](/images/milestones/milestone-03.png)

### Challenges:
* With the vision of eventually all items physically present and stored in the game world, with physicalized damage and degradation, with thousands of NPCs going about their lifes, with thousands of dynamic missions and events generated by AI and players, with a fully simulated economy, all in a potential single-shard server mesh, all the game information needs to be persisted into databases and then accessed by and networked between the game servers and clients in real-time, requiring an architecture that is able to handle high amounts of data.

__Solution:__ Persistent Entity Streaming (or Persistent Streaming or just PES), complete Interest Management with Full Persistence

__Requirement for:__ Server Meshing, Full Persistence

__Goals:__

* Have a persistent world where everything is stored into databases and loaded (streamed-in) by the game servers, clients and various other services that need that data.
* Allow for all items to be placed anywhere in the game world, persist over large amounts of time and be visited and retrieved later.
* Split State Persistence and State Replication from the Game Simulation by moving that logic out of the game servers and into services.

__Approach:__

* Introduce a highly scalable, cloud-native service backend architecture for high data throughput, low latency, high responsiveness, fault tolerance and crash recovery.
* Besides new logic, this requires a lot of existing logic to be moved out of the game server and into their own services/servers.
* Introduce:
* Two databases: EntityGraph database & Global Database.
* "EntityGraph service": Allows other services to accesses the data of those two databases or move data between the two.
* Replication Layer service: Handles communication between game servers and clients with a cache to store and network the entity state.
* StarSim Economy Simulator: Simulates the economy in a high-level abstraction environment to create a realistic action-reaction system.
* The game server is just left with simulating the game, streaming in all necessary data in and out.
* Uses gRPC (Remote Procedure Calls) for communication between services and game servers (speculated: does not use only RPC).
* The initial persistence solution was attempted with a relational database, which, after internal testing, didnt live up to performance and latency requirements. So, a switch to a graph database and the Replication Layer service commenced end of 2020/early 2021.
* A first version comes online with the Replication Layer and EntityGraph in Alpha 3.18.
* Moving the Replication Layer out of the game server and onto its own server is the next step toward Server Meshing.

### EntityGraph & Global Database & EntityGraph service
For persistence to work, the game data needs to be stored outside of the game servers. Databases are generally used for such a task, because data can be saved to them and later retrived/queried.

The game data of Star Citizen will be stored into two different database:

__EntityGraph database:__

* This is the successor to the pCache database which was introduce when SSOCS came online in Alpha 3.8.
* EntityGraph is a sharded, horizontally scalable graph database.
* It stores the entities which physically exist in the game world.
* Referred to as 'unstowed items'.
* This includes spawned ships, players, coffee cup, etc.
* Each game world has its own EntityGraph database to store its unique state of the game world independently from other game worlds.
* speculated: EntityGraph uses ArangoDB.
* A offline, in-memory version has been developed for the singleplayer game Squadron 42.

__Global Database:__

* The Global Database is the successor to the Long Term Persistence (LTP) database which was introduced shortly after SSOCS came online.
* It consists of three separate data collections:
* Stowed Items
* Wallet (aUEC)
* Reputation
* It stores the entities which are hidden away, only exist inside of inventories or are stored away (e.g. un-/despawned ships). Referred to as 'stowed items'.
* There only exists one Global Database for all game worlds (notice its name containing 'global').
* This allows ships and inventory contents to be accessible from every game world.
* Even if players change to another game world, their stuff will still be available in that game world as well.

### EntityGraph 1/4 - Graph database
EntityGraph is a graph database and is the successor and replacement for the pCache, introduced with Server OCS.

Inside the graph database, game objects are represented as 'nodes'. Connections are made between nodes to symbolize a relation, also called 'edges' in the graph. A ship would be a node and all entities inside - like players and any entities the ship consists of - would also be nodes and be connected to the ship via an edge. The two main strengths of a graph database is that each edge can further describe the relation between two nodes. It also allows for arbitrarily complex queries.

This works perfectly with how Object Containers, Entity Aggregates, Entity Hierarchies and the ZoneSystem create a tree data structure, as well as how this information has to be read and written. While entities are moving around in the game world or interacting with one another, edges between nodes can easily be added and removed as well. This happens when entities move from one zone into another or entities detach/attach to each other. Adding, updating and removing nodes and edges are cheap database operations, which make up the majority of performed actions while simulating the game.

When a new entity is spawned, a new node containing the state of the entity is easily added into the graph. This may also happen when items are taken out of inventories.

![Image](/images/persistent_entity_streaming/image-01.png)
![Image](/images/persistent_entity_streaming/image-02.png)

### INTERMISSION: Database Sharding & Replication 1/3
In terms of storage space, a single database might be able to store the entire universe data. But, in terms of processing power, when one day having to serve dozens or hundreds of game servers, it most definitely cant keep up. Too many read and write requests would hit a single database server. Just like game servers, databases have limited computing power. The solution? Splitting up the persisted data and then distributing the load by horizontally scaling the database across multiple database servers.

![Image](/images/persistent_entity_streaming/image-03.png)
![Image](/images/persistent_entity_streaming/image-04.png)
![Image](/images/persistent_entity_streaming/image-05.png)

### INTERMISSION: Database Sharding & Replication 2/3
For example, the data of each planetary system could be its own Database Shard sitting on its own server. These sub-sets can be created through a sharding key and chunks. With these techniques, a router service is able to determine, in which sub-set and thus database shard a specific piece of data is being read from and written to. Therefore, the (also horizontally scalable) router service makes sure that the read and write requests reach the correct database shard. These router lookups are fast operations compared to the actual queries on the DB shards, so dont add a lot of latency.

__Speculated:__ The amount of sub-sets and thus database shards could be changed or even scaled automatically, depending on the load.

EntityGraph uses the common 'Database Sharding' technique. Instead of one database server containing the entire data, the data is instead logically split into sub-sets. And each sub-set is then stored on its own database server, a Database Shard (Important Note: this has nothing to do with 'Game World Shards' which we will learn more about in the Server Meshing topics).

![Image](/images/persistent_entity_streaming/image-06.png)
![Image](/images/persistent_entity_streaming/image-07.png)

### INTERMISSION: Database Sharding & Replication 3/3
But what would happen if one such database shard crashes or is not reachable? To minimize the loss of data and increase fault tolerance and service availability, EntityGraph also makes use of Database Replication. A data sub-set does not exist on just one database shard, but across additional database shards, which are called Replicas. With this, the same data exist as copies on multiple database servers at once (also known as Data Redundancy). These Replicas can be used to make queries against and loaded from, allowing more requests to hit the EntityGraph.

This also enables database crash recovery functionality: If one database shard goes down, another Replica can take over. The crashed database shard (or Replica) can be spun up again and the data can be copied/replicated back to ensure that there are always enough servers with the copies of the same data available and no data is ever lost.

Going forward we will show and talk about EntityGraph as if it is just one database server. But remember, especially once game worlds are simulated by multiple game servers, that each game world will have its own EntityGraph (collection), consisting of many database shards and router services. (Or - speculated - each game world has its own separate collection in one large EntityGraph database.)

![Image](/images/persistent_entity_streaming/image-08.png)

### EntityGraph 2/4 - Another database: The Global Database
Alongside the graph databases, there exist another database: The Global Database. But why another database? Why the need for two databases?

The reason for this is that each game world has its own state. And this state is saved into its own EntityGraph database (collection) where all physicalized entities of that specific game world are saved into.

In comparison, the Global Database allows specific data to be made available to all game worlds. Therefore there exists only one Global Database for all game worlds, in contrast to one EntityGraph database for each game world. This is required for player ships, all items on the player character or inventories in general, which should be available in the same state, independent on which server the player is currently playing on.

The Global Database stores data related to Reputation, Currency (aUEC) and - most interesting here - Stowed Items. Items are interesting because they can be persisted in either the EntityGraph or the Global Database, depending if they are stowed or unstowed. We have a deeper look about items on the next slide.


### EntityGraph 3/4 - "Entity-Graph service"
Last but not least, besides the two shiny new databases, we also have a new scalable service specifically for facilitating persistence. These new services sit in front of the two databases and allow query requests to be sent from other services/servers that need to access their data. Because some write requests expect changes to be made to both databases as part of one transaction (see Stow & Unstow feature on the next slide), the services handles and relays the appropriate database queries to the databases.

The "services provide translation from our game specific 'query language' into the query operations of the underlying database and translate the results back into a form the game can easily understand. [They] also provide extra reliability and scalability guarantees [...]. What [they dont] do is any form of caching, however it talks to a NoSQL database that performs its own distributed in-memory caching. Not only that but the database is specifically and optimized for graph data which is a much better fit for the type of queries we need to do."

__Note:__ In a followup patch to Alpha 3.18, CIG did introduce caching for Global Database queries in the Entity Graph services: "The team also added inventory query caching to the entity-graph service. This stores the results of inventory queries in a cache to take the load off the database for repeated lookups of the same query, allowing for faster response times and less load on the database. This increases the overall read and write performance of the entity-graph service."

__Note:__ It seems "EntityGraph" can refer to the whole persistence backend solution, just the persistence services, the graph database or even the Global Database/Global Persistence. Confusing, I know.

![Image](/images/persistent_entity_streaming/image-09.png)

### EntityGraph 4/4 - The Stow & Unstow Feature
The Global Database and Stowed Items are important in the context of Persistent Entity Streaming. Even though the goal is a single game world, a "Single Shard", until Server Meshing provides the performance for it, there will still exist multiple game worlds in parallel. Therefore, initially players have to be able to move between game worlds, determined by matchmaking, whenever players log-out and back in. In this case, the player items need to move with our player characters between game worlds. The Global Database enables this capability and makes our data accessible to all game worlds.

For this, the architecture now differentiates between stowed and unstowed items:

* When an item exist physicalized in a game world, it is an unstowed item and is stored in the EntityGraph database of that game world.
* When an item exists inside inventories or is a un/despawned ship - and therefore only interactable from the UI - then they are considered stowed items and are stored in the Global Database.

Therefore, whenever items are moved into an inventory, its EntityGraph node (e.g. Gun #9001 in the image) is removed from the EntityGraph database and a new entry is created into the Global Database (e.g. into the Inventory of Box #123). If an item is taken out of an inventory or a ship is spawned, then it is removed from the Global Database and a new node is created in the EntityGraph (an edge as well). All items stay unique.

![Image](/images/persistent_entity_streaming/image-10.png)

### The Replication Layer 1/2 - Rollout
But PES does not just consist of databases. While, Persistent Entity Streaming feature came online in Alpha 3.18, the groundwork had been layed since at least Alpha 3.13/3.14, where code has been moved around in the game server code to prepare for the Replication Layer. We will talk more about this Replication Layer in a lot more detail in the upcoming Server Meshing topic. For now, all we need to know is, that a lot of the OCS and PES code has been moved into this Replication Layer, with the purpose of being able to move it out and onto its own server later.

After the prep-work in Alpha 3.13 and 3.14, in Alpha 3.15 the Global Database came online and the Replication Layer was setup to make queries against it. Inventories came first online with this update.

In Alpha 3.17, the Replication Layer now copies parts of the game world into its own memory/cache which is then used to run the OCS loading and networking logic.

And then, in Alpha 3.18, the EntityGraph database came online and with it, PES and the persistence of most ingame items/entities. The Replication Layer was setup to both read and write to the EntityGraph database and the Global Database.

![Image](/images/persistent_entity_streaming/image-11.png)

### The Replication Layer 2/2 - Migration onto its own server
After PES released in Alpha 3.18, the next step in the plan was to move the Replication Layer out of the game server and onto its own, separate server.

This is necessary for Server Meshing, as the Replication Layer will be responsible for the communication between the clients and multiple game servers. However, initially, there will only be a single game server connected to the Replication Layer. Only after it is tested and working, will the number of connected game servers be increased, at which point Server Meshing starts to comes online.

Once the Replication Layer is moved out of the game server, it is sometimes also referred to as the Hybrid Service. The Hybrid Service likely contain some additional functionality required to Server Meshing (e.g. it's Atlas component, more on that later).

This shows that Persistent Entity Streaming and Server Meshing are two tightly coupled features and were developed alongside each other. We will go into more detail about the Replication Layer/Hybrid service and the Server Meshing architecture as a whole in the next major topics.

![Image](/images/persistent_entity_streaming/image-12.png)

### Service Migration & Economy Simulation
Last but not least, a lot of additional work was done toward Server Meshing in order to allow multiple game servers to share and access the same data of the game world. Many more - here unnamed - services had to be created, some with entirely new functionality, others with existing logic which had to be moved out of the game server code into own services (e.g. the ATC logic responsible for having players and NPC make request and being assigned a free hangar/landing pad).

Similarly, data which is generated from the Economy Simulation will also be made accessible to all game worlds and game servers. Relevant player actions within all game servers will be fed back into the Economy Simulation, to have all players effect each other, even if they are not all playing in the same game world.

Have a look at the "Service Migration & Creation" minor tech slide for more information.

# Static Server Meshing

![Image](/images/milestones/milestone-04.png)

### Overview
After the first version of Client OCS was released, work on Server Meshing could finally begin.

__Challenges:__

* A single game server is still overloaded with the amount of players/entities, and adding more increases CPU load even more.
* Using better server hardware isnt a scalable enough option, so we need to make game servers horizontally scalable instead.

__Solution:__ Static Server Meshing a first version of and intermediate step toward the planned Dynamic Server Meshing implementation, introduces distributed computation/simulation (released in Alpha 4.0)

__Goals:__

* Make use of Distributed Computation to have multiple game servers compute the same game world by sharing the computational load.

__Approach:__

* Introduce the concept of Entity Authority which allows the simulation load to be distributed/shared across multiple game servers:
* Each game server can now be assigned 'authority' over specific entities (meaning only that game server determines that entity's state).
* A game server could now simulate just a subset of entities of a game world, instead of all entities by default.
* Introduce the feature of Authority Transfers where the authority over an entity can be seamlessly handed off from one game server to another. Note: While playing, players can only move between game servers of the same game world, not between different game worlds.
* A new Hybrid service is introduced (initially called the Replication Layer, which is also the cornerstone of Persistent Entity Streaming):
* Connects to and coordinates the communication between clients, game servers and the databases.
* Relays entity state updates between clients and game servers.
* Determines which objects should be loaded via OCS on which client and game server.
* Also manages the Shard as a whole, populating the EntityGraph, starting up the game servers and connecting them to the Hybrid.
* Consists of multiple components: Replicant, Gateway, Atlas, Scribe. These will be turned into their own scalable services later.
* New terminology specific to Server Meshing is introduced:
* A game world that is simulated by multiple meshed game servers is referred to as a 'Shard' (a Game World Shard, not Database Shard!)
* A game server is sometimes referred to as 'Server Node' as it is now part of a larger network/mesh.
* For the static version of Server Meshing, limitations are set in place (which will be lifted under Dynamic Server Meshing):
* The game world is spatially split into multiple sections and each game server is responsible/limited to simulating one such section.
* These sections limit the area a game server can have authority over.
* The area of these sections stays fixed/static, as well as the amount of game servers that compute the same game world stays fixed.
* Design for Server Meshing was changed end of 2020/early 2021 to utilize the Replication Layer as a 'middle man' service (instead of using direct server-to-server communication which may have failed to provide the required performance).
* The first version released as part of the Alpha 4.0 Preview together with Pyro. Each solar system was split and run by 5 game servers for a total of 10 game servers for 500 players.

### Initial Situation
With the first versions of Object Container Streaming (OCS) for both client and server done, we are finally able to move onto the initial goal: Server Meshing. Even with the OCS software systems in place, it is not possible to increase the player count to thousand of players nor add tens of thousands of objects into the game world to make 100+ detailed solar systems a reality. A single game server alone is simply not powerful enough.

Since the software technology that is Server Meshing is very complex, it is to be expected that it will take a long time to develop. To provide players a first version sooner, CIG decided to release a simpler, intermediate version of it first: Static Server Meshing.

This should theoretically allow AI improvements, gameplay mechanics and more solar systems and locations as well as slightly higher player counts to be added to the game sooner, even before work on the final Dynamic Server Meshing implementation would be completed. We will talk more about the different versions shortly.

![Image](/images/static_server_meshing/image-01.png)

### A simpler visual abstraction for game servers and clients
Since we are now entering the topic of Server Meshing, we need to represent the network connections of servers and clients in a more simplified fashion.

The left half of the picture shows the server at the top and the connected players with their game clients at the bottom. Together they are forming a single Game World. There exist dozens of these Game Worlds independently from each at the same time. As before, the clients and servers are connected via a network (which in this case would be the internet) to allow information to be exchanged as data packets to have the server and clients stay synchronized.

The right half the picture shows our new simplified version. We now represent the game servers as rectangles and player clients as circles. Since each server and client is unique, we will sometimes identify them with numbers (and colors in the case of the player clients).

![Image](/images/static_server_meshing/image-02.png)

### Game Worlds and Game Servers
So far, each game world was simulated by a single game server (also sometimes called Dedicated Game Server or DGS).

Furthermore, we can think of each Game World as its own "Star Citizen universe" with its own, independent state and happenings.

All these game worlds/universes create a "multiverse". We can see this multiverse in the image on the right. Each game world is computed by a single game server/DGS. (The clients connected to the DGS are not shown).

The main downside is that each DGS currently simulates it's entire game world and thus only supports a limited amount of entities, only up to 50 players and after some time ends up being under heavy load from all the loaded entities. Which makes player interactions rather rare and limited.

![Image](/images/static_server_meshing/image-03.png)

### Endgoal of a Single Game World
Therefore, the ideal end goal is to have all players in the same game world. Thus, can meet up, see and interact with each other freely. With only one game world, there would only be one universe and no "multiverse" anymore.

This is going to be achieved by having all DGS computing the same game world. For this to work, different entities are computed by different DGS. So each game server only has to simulate a small amount of entities instead of all entities in the game world. The game server that is responsible for simulating an entity is said to have authority over that entity. This authority can also be handed off between game servers.

At the same time, the networking logic of Client OCS will make it possible for players on two different game servers to still see and interact with each other.

Under Server Meshing, a game world is referred to as a Shard, a term coined by the MMO Ultima Online. Note: These are 'Game World Shards', not Database Shards (see the Persistent Entity Streaming topic).

However, while this is the end goal, for this single Shard/Game World to work it might require a very mature Dynamic Server Meshing implementation and capable lag compensation netcode. Until then - before all DGS are computing one and the same game world - we will have multiple intermediary versions of Server Meshing. In those versions, we will continue to have multiple game worlds (and thus still a multiverse).

![Image](/images/static_server_meshing/image-04.png)

### Intermediate steps
Over time and across many patches, the amount of game servers per Shard is going to to be increased. And in turn the number of entities (more locations with more items) and players per Shards can be increased as well. Fewer and fewer Shards will be required, until potentially - one day - a single Shard consists of enough DGS so that it can handle the load of all players (of a region/continent or world-wide).

CIG likes to refer to their game servers - on which a game server executable/program runs - as a Dedicated Game Server (DGS). Under Server Meshing, they are also referred to as Server Nodes to highlight the meshed environment. We will use the terms game server, DGS and Server Node interchangeably as they mean the same thing. A server that simulates (a part of) the game world.

However the difference - even in the intermediate Server Meshing versions - is that each game world is already being simulated by more than one game server. The game servers of the same Shard can exchange entity state data with each other. With these network connections, the DGS are "meshed" together, forming a "mesh network" of game servers. The game servers end up being meshed: (Game) Server Meshing.

Once a game world is computed by more than one game server, we refer to that game world as a "Shard". This helps us differentiate the game worlds being simulated by multiple meshed DGS, from the game worlds running on a single DGS ('game world instances' vs 'game world shards'). Each Shard will still be its own SC universe, with its own Stanton, Pyro, Nyx, ect. but do share the same economy from the StarSim Simulator.

![Image](/images/static_server_meshing/image-05.png)

### Shard Transitions vs Entity Authority & State Replication
There are going to be different types of transfers happening under Server Meshing. Lets have a quick look at each one:

* Entity Authority Transfers will only be used within a Shard to pass authority beween two game servers of that Shard. That means authority can never be passed to a game server of a different shard. Remember that each game world has its own contained state of the game world and its own game servers that simulate only that state. An Authority Transfer means that another game server is made responsible for simulating the entity. These authority transfers are happening infrequently and will be more frequent, once Shards are scaled with more game servers simulating different parts of a game world.
* (Player Item) Shard Transfers are transitions that happen across two shards. This can only happen while a player is not actively playing and will eventually be triggered by matchmaking when we are put into a different shard rather than the one we last played on (e.g. because we want to play with a friend on another shard). These Shard Transitions will become less and less frequent the larger shards are scaled, because players are more likely to keep playing in the same Shard across multiple play sessions. Ideally (!) we would have just one Shard, so that no Shard Transfers are necessary.
* There is also Entity State Replication, which could be seen as the transfer of entity state and actions. Here, entity state is send to different machines, such as player clients, the EntityGraph database and other game servers (more on this later). Like Entity Authority Transfers, the replication of state occurs only within the same shard. Sending this state is very frequent and can happen multiple times a second, sometimes on each game tick. Serialized Variables and OCS optimize this.

![Image](/images/static_server_meshing/image-06.png)

### Major and Minor versions of Server Meshing
In the very first version of Server Meshing, each Game World (Universe/Shard) will mostly likely only be computed by a few game servers. Mainly to be able to test the functionality in a simple and controlled environment.

Afterwards, it will be increased to more and more game servers across multiple patches. While there are going to be many of these gradual increases, there are going to be two major versions which Server Meshing can be categorized into:

Static Server Meshing

* A game world is going to be split manually into sections by the developers. Each section will be simulated by one game server.
* The name "static" means that these sections stay unchanged in their virtual size and amount (and thus also the amount of game servers).
* Game servers (indirectly) exchange information whenever necessary, e.g. to allow for seamless transitions and interactions of entities, as well as game servers exchanging entity state with each other where necessary (e.g. for collision checks).
* There will still exist many Game Worlds/Shards along side each other, since not enough computing power will be available yet to fit all players into a single Game World/Shard.
* A performance issue with this implementation exists: when all players of a Shard meet up in one section, then all have to be computed by one game server. Then that game server will be overloaded again, dropping in tick rate and negatively impacting the player experience.

Dynamic Server Meshing

* The size and amount of these sections wont be fixed anymore. Instead each game server is now able to follow its players wherever they go.
* The name "dynamic" also means that the amount of server nodes can increase and decrease, besides the entities a game server is simulating changed on-demand anytime. The game world can be split up differently while we are playing the game.
* All of this is done programmatically, meaning that - for each Shard - an algorithm is monitoring the performance on all of its game servers and then tries to optimally distribute the load across those game servers. More game servers can be spun up or existing, underutilized ones shutdown.
* There will also be multiple minor versions of Dynamic Server Meshing, each increasing the number of game servers per Shard, until eventually all players of a geographical region (EU; US, etc.) fit into one single regional Shard, maybe even all players world-wide into a single word-wide Shard.

### Entity Authority & Authority Transfers 1/8
(Static) Server Meshing splits the level into multiple sections to simulate each one on its own server. For example, the Stanton solar system could be split in half. Then two game servers could compute two planets each.

In our example on the right, this split has been the green and red boxes. We only split the level into two sections, however Static Server Meshing could allow for dozens of sections (e.g. each of the major planets and each of their moons in the Stanton system on their their own server). However, this might be an inefficient use of servers since it could lead to a lot of empty or low load servers. Therefore, it initially will be divided in as few sections as possible for testing purposes, then slowly increased in numbers over subsequent patches, with Dynamic Server Meshing the next goal.

In our example, we split the game world into two sections, red and green.

We are going to explore the concepts of Server Meshing by following the journey of the blue players which is about to travel from Microtech to Hurston.

![Image](/images/static_server_meshing/image-07.png)
![Image](/images/static_server_meshing/image-08.png)

### Entity Authority & Authority Transfers 2/8
In our example, we will have our three players again, just like we did in our previous examples for Client and Server OCS. The difference is that we now have two game servers instead of just one.

We don't show the clients anymore, but remember that loading and networking via Client OCS is still happening. But we rather want to focus on how the game servers simulate and handoff entities between each other (or 'server nodes' as they are also called under Server Meshing).

We can see the split in the level by the green and red boxes. Players Red and Green are busy on the second game server (green box). Meanwhile, player Blue is loading cargo on the first game server (red box). We can see that the servers don't load the entire game world anymore - even if there are players - and instead only focus on their box/section. However, that might not be entirely accurate.

![Image](/images/static_server_meshing/image-09.png)

### Entity Authority & Authority Transfers 3/8
__Speculated:__ To make server handoffs smooth and seamless, there might be an area at the borders in which game servers overlap slightly, meaning both servers load the same entities into memory. Therefore, we have updated the boxes to also overlap. The authority transfer might still happen at a fixed boundary tho.

We also need to highlight which server computes which entities. For this reason, we now color the players by the color of the game server who currently is responsible for simulating it. Our blue player being computed by Server Node 1 turned red, and the other two players on Server Node 2 turn/stay green.

When a game server simulates an entity, then we say that this game server has authority over the entity and its state. This feature is called Entity Authority and we will explore this in more depth in later slides.

For now, let us see what happens, when the Blue player (now red to signify that game server 1 has authority and simulates it) is about to transport cargo from Microtech on Server S1 to Hurston on Server S2.

![Image](/images/static_server_meshing/image-10.png)

### Entity Authority & Authority Transfers 4/8
Once the blue player starts quantum traveling, Server OCS will continue loading and unloading the game world around the players. However, game servers are now limited, in what they can load and can have authority over, to their box. Once the Blue player closes in on the section/box of the server 2, the server will start to load the game world.

This implies multiple game servers may have the same game objects loaded into their memory. Which is one of the requirements to ensure a smooth handoff.

__Speculated:__ How this is going to work exactly is still unclear. Even tho we show that game server 2 would gradually load the game world while the player approaches its section, it might be that a server only starts loading an area once the player entered its section.

![Image](/images/static_server_meshing/image-11.png)

### Entity Authority & Authority Transfers 5/8
The Blue player continues to travel through the level and now the player entity is in the overlapping section. Server OCS continues to do its job and now the player entity is loaded into the memory of both game servers.

At this point, game server 1 starts sending entity state changes of the blue player to game server 2. This allows both servers to have the same/similar entity state. This is referred to as game server 2 receiving a 'client view' of the Blue player. This view is send via the new Hybrid service which we will learn more about soon.

It is important to note that game server 1 still has authority over the Blue player. But it is in this overlapping area (or at the zone/box border) that authority can be handed off to another game server. When a handoff occurs, authority is taken away from game server 1 and given to game server 2. We will see on the next slide that the color of player Blue will turn green.

![Image](/images/static_server_meshing/image-12.png)

### Entity Authority & Authority Transfers 6/8
The Hybrid service and its Atlas component is responsible for assigning authority to game servers and decides when authority is transferred between game servers. In the first version of Server Meshing, transfers will only happen in deep space somewhere between planets, but the dynamic versions it is supposed to have that happen anywhere anytime.

Only one game server can have authority over an entity at a time, never more. However, other game servers can receive state updates of an entity from the game server with authority (more on this on the next slide).

As we can see, authority of the Blue player was handed off to game server 2 and we changed to colors to green accordingly. Game server 1 does not simulate the Blue player anymore and instead receives the client view from game server 2.

![Image](/images/static_server_meshing/image-13.png)

### Entity Authority & Authority Transfers 7/8
The Blue player continues their journey, now simulated by the second game server. Server OCS continues to load and unload the game world accordingly on both game servers. However, the decision making (what needs to be loaded) is not done by the game servers individually anymore and instead the Hybrid service figures out which Object Containers have to be loaded on which game server (and clients as well for Client OCS).

For this, the Hybrid services/Replication Layer makes requests to the EntityGraph database and loads the game world - around the players - into its own memory/cache. That is why we can think of the level shown on the left in our example as the Hybrid service. However, the Hybrid service does not simulate anything. That is the responsibility of the game servers. But we can think of the Hybrid service as having client views of all entities on the game servers.

![Image](/images/static_server_meshing/image-14.png)

### Entity Authority & Authority Transfers 8/8
In our example, the Blue player has now arrived at Hurston and starts selling his cargo for a profit.

We notice that game server 1 now has no players in its section of the game world anymore while all players are on server 2 and have most of the locations loaded. This showcases the bottlenecks of Static Server Meshing very well:

Empty of half full game servers are underutilized (costing as much to rent as game servers under full load), while game servers with too many players/entities can still end up being overloaded again.

These downsides will be overcome with Dynamic Server Meshing, where game servers can be spun up and shutdown on-demand and where the green and red boxes do not exist anymore. There, this "area limitation on Entity Authority" - by assigning sections of the game world to specific game servers - wont exists anymore. Instead, authority will be much more fluid and game servers can follow its players and keep authority over them wherever they go. We will explore this in the Dynamic Server Meshing topic tho. For now lets have a deeper look at the Hybrid service.

![Image](/images/static_server_meshing/image-15.png)

### INTERMISSION: State Replication to Game Servers (Client Views for Game Servers)
When game servers overlap in the virtual space, they load the same entities into their memory. This is what Server OCS does. Since only one game server can have authority over an entity at a given point in time, the Hybrid service can decide to send state updates to other game servers which do not have authority over that entity. This is the same or similar entity state data which the player clients receive. Which is why CIG initially explained it as "client views for game servers".

This way game servers can let each other know what's going on and keep entities synchronized on multiple game servers. This can then be used for those seamless authority transfers between game servers.

![Image](/images/static_server_meshing/image-16.png)

### Entity Zones - Game World splitting via the ZoneSystem 1/2
To understand how Entity Authority and Authority Transfers will work, we also need to talk about Entity Zones. In order to have different server nodes of a Shard compute different sections of the game world, there needs to be logic that splits that Game World into such sections. These in-game sections are referred to as Entity Zones (speculated: sometimes called Territories).

Splitting the Game World will make heavy use of the existing ZoneSystem (physics grids). It already splits the Game World into sections (see ZoneSystem topic).

A Zone can be a room, spaceship interior, landing zone or even a planet/moon, planetary system or an entire solar system. Multiple Zones form a tree structure.

Without Server Meshing, the entire Game World can be thought of to be just one single large Territory. All these Zones and all entities within would be computed by exactly one DGS. The entire Game World is therefore computed by a single game server. This is shown in the images on the right, where all zones are marked with a red color. But, on the next side, once we can have multiple DGS (server nodes) working together, there will be many Territories in a single Game World.

![Image](/images/static_server_meshing/image-17.png)
![Image](/images/static_server_meshing/image-18.png)
![Image](/images/static_server_meshing/image-19.png)

### Entity Zones - Game World splitting via the ZoneSystem 2/2
As Zones can be nested (e.g. a landing zone on a planet or a vehicle inside a spaceship and the spaceship inside a hangar on a planet), a tree data structure of Zones emerges. Such a tree data structure can be split into multiple sub-trees.

One such sub-tree could then be computed by one server node. Sub-trees themselves can be further split or merged into more or fewer sub-trees and thus Territories. We will revisit the Zone System under Dynamic Server Meshing, where an algorithm will determine, which Zones are going to be part of which server node, factoring in the load in those Zones. For now, these zones will be assigned to game servers manually by the developers.

![Image](/images/static_server_meshing/image-20.png)
![Image](/images/static_server_meshing/image-21.png)
![Image](/images/static_server_meshing/image-22.png)

### Humble Beginnings - The Hybrid Service 1/3
The Hybrid is a service and the initial heart of Server Meshing.

The Hybrid service sits between the game servers, player clients and the EntityGraph database of a Shard. It can be seen as the glue that connects everything together by coordinating and communicating between clients (represented as circles with a C), game servers (server nodes) and database.

Initially, each Shard will have one such Hybrid service. The server nodes and player clients establish a network connection to the Hybrid to be able to send and receive data from it. The Hybrid will establish a connection to a EntityGraph database to request and store the state of the Game World.

Using a mediator service like this - which sits between everything - makes it easier for the logic on the clients and servers as they don't have to be aware of where their data goes to or comes from. It all goes to the Hybrid first, which takes care to further relay it to the actual destination(s). Furthermore, each server node and client only needs to establish a single connection to the Hybrid, rather than every participant having a connections to all other participants of a shard. The Hybrid reducing the number of direct interactions and required decision making that would otherwise have been done on each game server.

When the Hybrid first comes online, it will only feature a single server node to test it. Once this new infrastructure is working, more server nodes are added and Server Meshing comes online.

![Image](/images/static_server_meshing/image-23.png)

### Humble Beginnings - The Hybrid Service 2/3
The Hybrid service itself actually consists of multiple components, each one with its own functionality that is vital to bring Server Meshing online. Some of that functionality had already come online with the Replication Layer. The components that we know of so far are:

Atlas

* Manages Entity Authority and Authority Transfers

Replicant

* takes care of loading the game world on both client and servers
* takes care of networking the game state for both clients and game servers
* has the game state cached in its own memory, but does not simulate it, as that is the job of the game servers

Gateway

* takes care of sending data from/to player clients

Scribe

* Functionality still unknown. Likely persistence-related.

This is just a quick overview. These services have been talked about in lots more detail in their own Minor Tech slides. But, we are still going to drill down on the Replicant and Gateway components, as these play key roles in Server Meshing. More types of services have been teased but not elaborated on yet.

![Image](/images/static_server_meshing/image-24.png)

### Humble Beginnings - The Hybrid Service 3/3
However, the plan is to eventually move all these components out of the Hybrid to have them be their own services, running on their own servers. Once all components have been taken out, the obsolete Hybrid service will then be removed. This work is done when working on/toward Dynamic Server Meshing, after Static Server Meshing has released.

The individual service types are going to be horizontally scalable, meaning that multiple Replicant services could be running alongside each other. This is how Server Meshing is planned to be scaled up to support many more entities and players.

But - because the Shards for the very first versions of Server Meshing are still going to be very small (few server nodes and player clients) - a need for many services is not there yet. To bring Server Meshing online, have its functionality tested and made robust, a smaller, more manageable environment with a single Hybrid service is much more suitable. The infrastructure complexity and its overhead is minimal and the focus can be on maturing the functionality itself. Once that is working fine, the components will be turned into services and scaled up.

![Image](/images/static_server_meshing/image-25.png)

### Replicant & Gateway - The Deeper Look
The Replicant & Gateway are components of the Hybrid service. However, not all of their code is new. Parts of their functionality already existed as OCS and PES functionality.

OCS had already introduced various logic to load Object Containers on both clients and servers, as well as optimized the networking by only sending entity states to the individual player clients that need it.

And PES moved and grouped that logic as part of the Replication Layer.

For Server Meshing, that logic is now moved into the Hybrid service as part of the Replicant and Gateway components. And for later versions later moved out again, onto their own servers, to make those horizontally scalable and shards larger.


### Clients partially looking into multiple server nodes
All entities in the game world are persisted in the EntityGraph database which can be accessed by the Hybrid service (aka Replication Layer or Replicant).

The image on the right visualizes OCS under Server Meshing very well. Specifically how the individual game servers are partially loading and simulating parts of the entire game world with the help of Server OCS. As well as how the player clients looking partially into one or multiple game servers via Client OCS.

![Image](/images/static_server_meshing/image-26.png)
# Dynamic Server Meshing

![Image](/images/milestones/milestone-04.png)

### Overview
With splitting the game world and its simulation with Entity Authority, the next step is to make this solution dynamic for better scalability.

__Challenges:__

* while the individual servers are now less likely to hit their memory and CPU load capacities, the issue of too many players being in the same section of the game world, and thus on the same game server, still exists
* one solution would be to make the sections of all game servers very small, so that each one only has very few locations and spaces to compute. However, this increases server expenses and potentially to a lot of unoptimally used servers.

__Solution:__ Dynamic Server Meshing, dynamically distributing the simulation through load balancing

__Goals:__

* allow for very high player and entity count within a Shard (on the server-side; this shouldnt improve client-side performance)
* ideally, allow all players to play in one single Shard (either one Shard per region and/or even a single world-wide Shard)

__Approach:__

* The Entity Authority limitation for the game servers - game servers responsible for a fixed section of the game world - is lifted.
* Instead game servers can follow their 'authorized' players freely while those travel through the game world.
* Game servers can now overlap (in what they load), exchange 'client views' and transfer authority anywhere in the game world.
* New functionality is introduced as well:
* An algorithm/heuristic is introduced, which continuously monitors the computational load in the game world and decides for an optimal distribution of the computational resources (servers), by moving entities and their authority from an overloaded game servers to a underutilized game server.
* Whenever a Shard becomes too crowded/overloaded, an additional game server is spun up to provide more computational power. Likewise, game servers can be shutdown, if there is not much load. Less servers rented, more cost-efficient Shards.
* Break up the Hybrid service into smaller horizontally scalable services to allow for larger meshes/shards.
* "In May 2025, the Network team continued work on Dynamic Server Meshing, separating the DGS assignment from the territory manager."

### Features of Dynamic Server Meshing
The Dynamic Server Meshing (DSM) feature itself can be thought of as multiple sub-features and iterations.

* Dynamic Server Meshing V1 ("Dynamic Entity Zones"): The Entity Authority of Entity Zones can be passed between game servers automatically, to distribute the load optimally between the game servers of a Shard.
* Dynamic Server Meshing V2 ("Dynamic Entity Zone Splitting"): If the load is too high, a single Entity Zone can be further subdivided into "Simulation Islands", which can then be simulated by different game servers again. (Depends on DSM V1)
* Dynamic Starting & Stopping of Game Servers: Adding and removing game servers from a Shard, based on the load within, allows the renting cost of game servers to be reduced to an optimal minimum.
* Splitup of the Hybrid Service components/Replication Layer V2: Once DSM is working, the Hybrid service will become the bottleneck. Therefore, the individual components inside the Hybrid Service will be moved out and onto their own servers, to handle more load. The Hybrid Service will become obselete. (Depends on DSM V1)
* Dynamic Scaling of the Replication Layer V2: Instead of just one service per type, more services can be added (and removed again) so that multiple service run simultaniously and handle more load. This allows Shards to scale higher. (Depends on Replication Layer V2)

Some of these features have to come online before others do, so it is likely that not all of these features come online all at once, and instead get rolled out over multiple patches.


### Entity Zones - Dynamic Game World Splitting 1/2
As we have seen in Static Server Meshing, we are already able to split the game world using Entity Zones (see the images). However, these Zones would be assigned to game servers only at initial startup and setup of a shard and would stay fixed after that. This is one of the aspects that is going to be made dynamic now.

For Dynamic Server Meshing, an algorithm will monitor the load in the Entity Zones and game servers. If one gets overloaded (or underutilised), the algorithm can decide that the load should be distributed differently. It will then re-distributed the Zones across the game servers. This will happen seamlessly while we play.

As an example, lets assume there had been a lot of players at the spacestation in the top left of the level. But now, most of those players are moving over to a location near the top right of the right planet. Under Static Server Meshing, that might leave behind an underutilized red game server while the blue game server is going to be overloaded, maybe because it had a lot of players in one of its other locations already.

![Image](/images/dynamic_server_meshing/image-01.png)
![Image](/images/dynamic_server_meshing/image-02.png)
![Image](/images/dynamic_server_meshing/image-03.png)

### Entity Zones - Dynamic Game World Splitting 2/2
Under Dynamic Server Meshing, we can avoid overloaded and underutilized game servers by re-assigning Entity Zones to another game servers. In our case, it could decide that the red game servers is also going to simulate two Zones of the planet which were previously simulated by the blue game server. This way, the blue game server isnt overloaded and the red game server isnt underutilized.

To accomplish this, an (spatial partitioning) algorithm is going to monitor the load and decide, how the Zones are split and distributed among the game servers. The game servers might be given a period in which they load the other Zones before authority over the Zones are assigned, adding some complexity to the implementation. A special protocol might handle this.

__Note:__ If more players were to join the shard and all game servers are already under optimal load, then the shard might spin up a fourth game server (e.g. a yellow one) and the game world could once again be split up accordingly. Likewise, if players leave the shard, then game servers could be shutdown. But this dynamic functionality of starting and stopping game servers is likely going to be its own separate feature of DSM.

![Image](/images/dynamic_server_meshing/image-04.png)
![Image](/images/dynamic_server_meshing/image-05.png)
![Image](/images/dynamic_server_meshing/image-06.png)

### Dynamic Server Meshing Version 2 1/2
What we saw in the previous slides is just the first version of Dynamic Server Meshing. Once this works well, it will be expanded upon, because there are some ingame scenarios that may not work well with this solution. Mainly if many player meet up in a single zone. Especially in mid- to large-sized zones.

For example, if a lot of players were to go (back) to the spacestation, then the red server is assigned only the space station zone. But if there are so many player that even that isnt enough, a single zone and thus server still gets overloaded

To solve that we will have to make room for another game server.

![Image](/images/dynamic_server_meshing/image-07.png)
![Image](/images/dynamic_server_meshing/image-08.png)
![Image](/images/dynamic_server_meshing/image-09.png)

### Dynamic Server Meshing Version 2 2/2
We do that by splitting a single zone into even smaller sections, which have been called "simulation islands". This way a big zone can then be assigned to multiple game servers again, sharing the load.

In our example, the spacestation zone can be split into two smaller simulation islands and the green servers can help out simulating one of those islands.

__Note:__ It is still unclear if individual entities can be group up into such an island or if new zones are spawned on-demand. If it is individual entities, then it could be possible to put interacting entities into the same group (e.g. two ships shooting each other) instead of being restricted to spatial sections.

![Image](/images/dynamic_server_meshing/image-10.png)
![Image](/images/dynamic_server_meshing/image-11.png)
![Image](/images/dynamic_server_meshing/image-12.png)

### Free roaming of entities
Under Dynamic Server Meshing, most of the core logic of Static Server Meshing will stay intact. It is merely iterated and improved upon to be able to achieve larger Shards with more players and entities in them, while also managing the real world economical side of renting just the necessary/optimal amount of game servers. This is done by scaling the number of game servers and other services (Replicants and Gateway services) to the optimal amount based on ingame load.

For simplicity reasons (and because I felt lazy :D), we have removed the red and green boxes in the image below. The functionalities of Entity Authority, Authority Transfers, Entity Zones and 'client views' between game servers still exist and continue to be utilized, even tho we dont show it here.

![Image](/images/dynamic_server_meshing/image-13.png)

### Free roaming of entities
Without being tied to just one area anymore, game servers are now able to load any area of the game world and be assigned authority over the entities within those areas (and unload and unassigned of areas they leave behind). The game servers can follow their authorized players wherever they travel to. They load the area and will be assigned authority over it; if no other game server has been assigned authority already, that is.

In the example, the players of the green game server spread out in the level and their game server followed them. No authority handoffs to the red game server were performed.

![Image](/images/dynamic_server_meshing/image-14.png)

### Free roaming of entities
When players from different game servers meet up in the same location and the game servers "overlap", then they will load all entities in that area and start exchanging 'client views' of their authorized entities with each other. The same way they did at the section overlaps under Static Server Meshing. This way both game servers can make hit detection and collision checks cross game servers without each having to simulate the entities of the other game server.

![Image](/images/dynamic_server_meshing/image-15.png)

### Free roaming of entities
At this point, authority might be handed off anytime to one of the game servers. But it could also be decided that these players stay on their game servers, so it is also very possible that players stay on their assigned game server throughout their whole play session.

Maybe, most of the time, only interacting entities need to be moved onto the same game server (for example reduce server-to-server communication, the need for consensus techniques and ultimately to reduce computational load and save on game servers). For example, entities that travel past each other (like while flying, especially in Quantum Travel) do not need to be moved onto the same game server.

![Image](/images/dynamic_server_meshing/image-16.png)

### Free roaming of entities
When more players are joining the Shard, or there is more activity and load happening (like a big spacebattle), then more game servers can be spun up and connected to the Shard. The players and entities can then be re-distributed across the game servers for optimal load on each.

Likewise, in the case where a game server crashes, a new one can be spun up (or an existing server can take over for a short while), load the entities again and continue the simulation with only a minor disruption to gameplay.

![Image](/images/dynamic_server_meshing/image-17.png)

### Free roaming of entities
As mentioned, the load will be continuously monitored to try to have a smooth player experience and an economically optimal amount of game servers used. The entities of an underutilised game servers may be moved to another underutilised game server, so that one of those game servers can be shutdown down. In our example, the players/entities of the green game server were moved to blue game server, then the green game server shutdown.

![Image](/images/dynamic_server_meshing/image-18.png)

### Replication Layer V2 - Hybrid Service's component splitup
To achieve larger Shards, the individual components of the Hybrid services will be split out into their own servers. The Replicant, Gateway, Atlas and Scribe were components within the Hybrid service, but are then their own services. More types of services have been teased but not elaborated on yet. Once all components are moved out of the Hybrid service, the Hybrid service will likely be removed.

![Image](/images/dynamic_server_meshing/image-19.png)

### Replication Layer V2 - Architecture Changes
Without the Hybrid Service, the backend architecture is going to change, since player clients and game servers wont be able to connect to the Hybrid Service anymore.

Instead the player clients connect themselves to the Gateway service, while the game servers are connecting themselves to the Replicant service. The Gateway service establishes a connection to the Replicant service.

While there are now more services and network connections, overall, the behaviour of the Shard will stay the same as we had with the Hybrid Service. Therefore, this might be rolled out in a patch to achieve feature parity.

__Note:__ The name "Replication" stems from data being copied/replicated. "Layer" suggests that the data is passed through a layer before reaching its actual destinations (clients, server nodes and/or databases). A data packet is received, replicated, then send out to multiple, different computers/consumers.

![Image](/images/dynamic_server_meshing/image-20.png)

### Replication Layer V2 - Scaleup
Once this new architecture is working well, the whole thing is going to be scaled up. Meaning, we might have multiple Gateway and multiple Replicant services beween the clients and the game servers. Services may also be added and removed, ideally on-demand to what is happening ingame.

This way, the game world can be further distributed across the Replicants and more game servers, without overloading any single game server nor Replicant. For example, one Replicant and its game servers may be responsible for simulating the Staton System, while another simulates Pyro and Nyx.

__Speculated:__ Clients may have to establish connections to only one or multiple Gateway services on-demand. Each Gateway service establishes connections to one or more Replicant services.

All of these connections (and/or subscriptions?) are mostly likely managed by a service (Atlas?), since the services, game servers and connections/subscriptions have to be added and removed on-demand. Also in case of handing players and Entity Zones off from one game server/Replicant/Gateway to another.

__Note:__ How many Gateways, Replicants and Server Nodes are required is not known yet. The image shown might therfore not be accurate, as it just tries to visualize the general idea.

![Image](/images/dynamic_server_meshing/image-21.png)

### Replicant & Gateway 1/3 - Object Container loading
The Replicant & Gateway include what could be considered the decision making logic of OCS. Mainly functionality of Network/Entity Bind Culling and Serialized Variables Culling that were introduced as part of Client OCS. If we remember, these were responsible for

* determining which Object Container to load on both the clients and on the game server
* determining which entity state updates have to be send to which player client

__Note:__ The loading logic of OCS that actually loads & unloads the entities into/out of memory via Object Containers still resides on the game servers and player clients.

In the image below we can see the Network/Entity Bind Culling functionality in action. Previously, under OCS, the game server determined which Object Containers it had to load. After the game server had successfully loaded these Object Containers, it then told (some of) the player clients to load those Object Containers as well. Under Server Meshing, the Replicant is going to take over this part for the clients AND game servers. This has the benefit that Object Containers can be loaded on clients and servers in parallel (came online with Alpha 3.17). They dont have to load on the game server first anymore before the client is notified (which was a bottleneck without the Replicant).

![Image](/images/dynamic_server_meshing/image-22.png)

### Replicant & Gateway 2/3 - Entity State Network Replication
The entity state updates from server nodes are send to select clients and other server nodes of the Shard. This was previously determined by Serialized Variable Culling (part of OCS) in the game server logic, but now done by the Replicant service.

__Note:__ How and where exactly the decision is being made (Replicant and/or Gateway) was not yet clear to me. But we do know that the Replicant is copying parts of the EntityGraph database into its own memory - to cache entity states for quick read and writes, to know about the position of all entities. We also know that the Gateway is supposed to be a very lightweight.

__Speculated:__ Therefore, the Replicant might already be determining to which client(s) it has to be send and the Gateway just replicates and sends the data to the correct clients.

This allows players to receive entity state updates from multiple server nodes. This enables players to look into multiple server nodes and see entities and other players that are computed on other server nodes. This is also used when two server nodes have to sync up entities for an authority transfer/handoff when entities are about to cross from one Territory to the other.

The Replicant will update the data in its own in-memory cache with the data which was send from the server nodes (with authority) and persist these changes back to the EntityGraph database.

![Image](/images/dynamic_server_meshing/image-23.png)

### Replicant & Gateway 3/3 - Player Action Network Replication
In a similar fashion, the clients send their actions to the Gateway which in turn will relay those to the Replicant. And those Replicants will relay it to the correct server nodes that require this information.

__Speculated:__ It might be that the Gateway service also relays client actions directly to other clients, and not just to the Replicant. This would mean that player actions might end up on each others screen quicker. This would minimize latency until the verification from the server nodes would arrive, which in this case would follow shortly after (if the server node disagreed then the client will have to make rollbacks and adjust the entity state). This might be especially useful in a world-wide shard where the latency to the server node in another datacenter might be higher.

![Image](/images/dynamic_server_meshing/image-24.png)

### Multiple Shards
So far, we have only talked about how the Server Meshing functionality is built up and how the individual services, layers and the overall architecture emerge from it. But it is important to note that each Shard consists of one such architecture. Each Shard will have its own Gateway, Replicant, Scribe and Atlas services, as well as its own server nodes and clients.

Multiple such Shards can independently exists at the same time alongside each other (the multiverse). Players can only play in one shard at a time and thus can not see what is going on in other shards.

Certain data still has to be made available to all Shards tho. This data is stored in the Global Database. It also makes it possible to let players switch between shards.

![Image](/images/dynamic_server_meshing/image-25.png)

### Services and Databases
With this system the universe can be dynamically scaled based on the current activities in the game world. Other services and databases like the StarSim Economy Simulation, Dynamic Mission System, Item Cache, Account Database, etc. will be accessible to all game servers.

Ideally, all of these services will be designed in a way that allows them to be horizontally scaled, meaning they can be copied and distributed onto more than one data center. Or they all receive their own cache layer. To achieve a good performance, databases have to be replicated onto multiple data centers across the globe for all game server to have quick access. This also enables redundancy, basically the data is present in multiple identical databases, which in case of a database crash, a new database can quickly be spun up in its place by replicating the data from one of the other, still running databases. This might allow for one single world-wide instance where all players from around the world are able to play together without major interruptions and lag since there will always be a database server near a game server.

Theoretically, with later versions of Dynamic Server Meshing, game servers and Replicant and Gateway services could be geographically re-positioned on-the-fly to another data center where the latency of the currently connected players is the most similar to create a fair playing field for all players by reducing the chance of issues like peekers advantage from occurring. In general, as long as latency is stable and there is not a lot of jitter, network features (such as lag compensation and client side prediction) can guarantee a smooth and fair player experience even with higher latency to servers.

# Single Shard

![Image](/images/milestones/milestone-05.png)

### Overview
Even if a first Dynamic Server Meshing has been released, there is still more work left to be done to have it scale up and make a single shard possible.

__Challenges:__

* the early versions of Server Meshing wont be powerful enough just yet to allow all players to play in the same game world; we will continue to play in a multiverse, albeit less and less over time as shards grow in terms of how many players can support.

__Solution:__ Single Shard, one game world per region/world through architectural scaleup

__Goals:__

* have all players of a region or worldwide play in the same game world.
* gradually/iteratively improve and scale up Server Meshing until a single shard universe is possible .

__Approach:__

* scale up the amount of servers per Shards high enough so that all players can fit into a single shard.
* The first milestone/goal is going to be one shard per region (all players from US play on their own single shard, all players from EU play on their own single shard, etc).
* The final goal is offering a world-wide shard.
* This will require further R&D on how to reduce the impact of high cross-region latency.
* For scenarios where areas have extremely high population, a layering technique might be introduced that puts interacting players into their own layer (speculated: similar to instancing?).
* Speculated: There might be a time period where CIG will offer one shard per region as well as one world-wide shard. For the developers, this would provide a testbed for global shard tech, while offering the players a choice between an experimental experience in the global shard and a more stable one in the regional ones.

### From Multiple Shards to Single Shard 1/4 - Static Server Meshing
Initially- under static server meshing - all shards will be statically meshed. That means multiple, small and equally sized shards. Each region will have its own shards.

Even tho the individual shards are statically meshed, the number of shards can still change. For example, a new shard is spun up whenever more players login and want to play and all other shards are already full.

![Image](/images/single_shard/image-01.png)

### From Multiple Shards to Single Shard 2/4 - Dynamic Server Meshing
Once we have a mature Dynamic Server Meshing version online, shards start to be come larger and can end up being of different sizes, depending on the amount of players/entities and activity inside them. Each region will still have multiple shards.

![Image](/images/single_shard/image-02.png)

### From Multiple Shards to Single Shard 3/4- Regional Single Shards
Once Dynamic Server Meshing becomes powerful enough to support all players of a region, we may have Single Regional Shards. All players of a region will then be playing in the same game world.

![Image](/images/single_shard/image-03.png)

### From Multiple Shards to Single Shard 4/4 - World Wide Shard
Once Single Regional Shards are possible, work can begin on improving the lag compensation techniques. Those reduce perceived effects of latency for the players when playing across regions where latencies of over 200ms are possible. But further R&D is required for this. If it is possible and enjoyable, then all players play in a Single Worldwide Shard.

__Speculated:__ CIG might start offering an optional 'Worldwide Region' that will run alongside the existing regions, so players can choose between the regional and the worldwide shard. And maybe some day, the tech becomes capable enough where only the world-wide shard remains and the regional ones are removed.

![Image](/images/single_shard/image-04.png)

### Remaining Technical Limitations: Player Client = The Final Frontier
One final technical hurdle, that might not be completely overcome without some additional tricks and workarounds in the end, will be the rare scenario where thousands of players/entities are very close to each other and thus directly visible to the player client (like on a large flat surface on a planet). Even tho the game servers might be fine, the CPU/GPU computation on the player client might exceed its limits, resulting in dropping performance.

One way to push performance on the client would be to skip more network updates and simulation for further away objects to reduce the network bandwidth (Entity Component Update Scheduler can be improved to enable this). In terms of rendering, using the same, low level LOD asset for all far away player characters and vehicles would help with the rendering performance on the GPU (which may look worse but would still give the sense of a large, active crowd). But depending on the size of the crowd and the amount of objects, the experience might still not be great.

A drastic but simple workaround would be to limit the amount of objects to a small radius around the player (leading objects to pop-in and pop-out of existence in the distance), lockdown certain game areas via game mechanics (close jumppoints, NPC blockade, et.) or to create layers (parallel instances?) of the same area, taking into account friend and foe of players, but both of these solutions would have severe implications for gameplay that would need to be taken into account.

Anyways, in case of such a scenario, this quickly goes into the realm of major speculation with lots of possible solutions, so I guess we will leave it here and will know more once that point is reached. For the overwhelming majority of situations in the game, the system of Dynamic Server Meshing is expected to perform very well, because other players and objects will be far away or hidden inside buildings and ships and therefore can be hidden from the player client and reduce memory, CPU and GPU load to feasible levels without the need of workarounds.

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


### Recap of major tech features releasing

* Alpha 2.6 - Jan 2017 - Object Containers (preview/feature parity)
* Alpha 3.0 - Dec 2017 - Object Containers, Entity Components, 64bit coordidnates, Zone System, planet tech, new render pipeline, and many more (Large Engine Rework) (24 -> 50 players per server)
* Alpha 3.3 - Nov 2018 - Client OCS
* Alpha 3.8 - Dec 2019 - Server OCS
* Alpha 3.8.2 - Feb 2020 - Long Term Persistence DB (later reworked into the Global DB), less wipes between patches
* Alpha 3.13/3.14 - Apr/Aug 2021 - Preparations for the Replication Layer in the game server code
* Alpha 3.15 - Nov 2021 - Release of the Global Database, Global Persistence and Physicalized Items and Inventory (uses RL to make backend DB calls)
* Alpha 3.17 - Apr 2022 - Entity State Networking through the Replication Layer (networking part of OCS moved into RL)
* Alpha 3.18 - Mar 2023 - Gen12 + EntityGraph Database + OC Loading via Replication Layer (+cache for Global DB queries in EntityGraph services, all of OCS in RL)
* Alpha 3.23 - May 2024 - Replication Layer moved out of the game server into its own server (Hybrid Service)
* Tech Channel Previews - 2024 - Static Server Meshing
* Alpha 3.24 - Aug 2024 - Replication Message Queue Refactor
* Alpha 4.0 - Dec 2024 - Static Server Meshing with Jumppoints and the Pyro solar system (~150 -> ~600 players per shard)
* Alpha 4.? - Work In Progress - Dynamic Server Meshing V1

### Conclusion
If you made it this far, thank you for reading. I hope that this presentation was able to provide a good overview and a new appreciation for these technologies. As we can see, a lot of work has already been completed and we are getting ever closer to Dynamic Server Meshing for Star Citizen being a reality. Even after the release of Dynamic Server Meshing, all these software systems we talked about will most likely be continuously maintained, iterated over and optimized over many years to keep improving on the player experience and allow for larger Shards.

While this is the end of the major tech explanations, there is still much more information about each of the minor and related technologies left to check out. Feel free to keep on reading! And let me know if you found this overview helpful :)

Also don't forget to check out the sources at the end of the presentation with all the information for yourself!

And a big thanks goes to the developers at CIG for working on these software systems to make Star Citizen a reality!

# Special Thanks
### goes to the following community members
Bambooza

LeakimX

Opsdipsy

StarA

Kenge84

Maarkreidi

FelixReynolds

ShinyHobo

Lannar

AngoGonTal

SpaceTomato

Nazeris

AstroSam

Star Citizen Česko – Slovensko

Dani

Mitch van Hayden

Space Tomato

DG360

Sudo

Wurzel

Sawyer

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
# Multi-Threaded Loading & Execution
### Overview
In any game there are many Resources (e.g. textures, geometry meshes), which have to all be loaded into memory.

__Challenges:__

* loading large objects like spaceships into memory caused noticeable stuttering and freezes because the loading and following initialization process can take long amounts of time (>200ms) and this process being performed by the main thread on which the game simulation logic was being executed on, lead to those stutters and freezes.
* the game already loads Resources (like textures and geometry meshes into) the GPUs VRAM in a parallelized and organized way. However, with the introduction of Object Containers, there needed to be additional logic to ensure that Resources are loaded only once whenever they shared by multiple Object Containers and those Object Containers are loaded at the same time in parallel.

__Solution:__ Multi-Threaded Game Simulation and Loading of Resources and Entity Components, an long-going project to move loading into background threads and optimize the logic for parallel loading (work was on-going well into the Alpha 3.x releases)

__Requirement for:__ Object Containers, Object Container Streaming

__Goals:__

* load each Resource only once instead of multiple times to save memory while being able to load multiple Object Containers in parallel which may or may not share one or more Resources
* run the game simulation in multiple threads to allow for more entities to be computed in one game tick on the server and client

__Approach:__

* put the loading process of Object Containers, their Resources and Entity Component into a background thread
* use Fibers (similar to Coroutines) to have more control over the loading process of Object Containers
* keep track of the already loaded resources to reuse them for multiple object containers instead of loading them multiple times
* these changes were partially rolled out with Alpha 3.2, reducing stuttering and freezing noticeably
* with the introduction of Entity Components, the simulation logic was changed to have Component updates be executed in parallel. Therefore, the game simulation part of the game loop has been multithreaded as well.
* This is part of the Entity Component Update Scheduler. It also allows the simulation of individual components to be paused. This was based on distance to players, meaning that certain entities might have been loaded, but were not simulated until players were moving closer.
* furthermore, the loading process and the game simulation logic is not allowed to make changes to the same memory areas and therefore have to be managed to not interfere with each other. Otherwise, this may lead to unexpected behavior, like data corruption and game crashes. Therefore, the loading process has to wait until the game simulation of the current game tick has completed and only then add any loaded objects to the level. Likewise, the game simulation has to wait when the loading process is busy with adding objects.
* Entity-Aggregates and Zone Hosts help to optimize the multithreading of the simulation, by grouping entities that should be updated together.
# MegaMap
### Overview
__Challenges:__

* currently, when loading a level (like the PU, Arena Commander, Star Marine, even the main menu because that's a level too), first the old level has to be unloaded entirely to then to load the new level into memory. Also network connections to servers have to be disconnected and established again. This increases loading times significantly.
* this also leads to inefficient transition between different levels/scenes from a memory perspective. Some resources (like models and textures) that are used in both levels are first unloaded then directly loaded again unnecessarily and instead could have stuck around in memory to be reused.

__Solution:__ MegaMap

__Goals:__

* be able to load and unload Object Containers and their Resources "globally" (rather than loaded as part of a specific level) to be able to reuse them across many levels.
* from a memory perspective, only one large "level" exists now, in which everything is loaded into, making switches between different levels, gamemodes and servers much more efficient and faster.

__Approach:__

* all content will be loaded into a "single level", the MegaMap, where object containers and object resources (like geometry, textures, sounds, etc.) can stay in memory, loaded and unloaded at any time, even being able to easily switch between different gamemodes (singleplayer and multiplayer levels) without having to unload everything first
* this feature will be used someday to seamlessly access Arena Commander, Star Marine and Theatres of War and other gamemodes from inside the Persistent Universe as in-game, in-lore video games
* speculated: the name "MegaMap" likely refers to the Map data structure. Essentially a lookup table in which all Resources are loaded into and accessed via a key/name. With all resources stored in this Map, it would be a "Mega Map". Therefore, this would have nothing to do with the 64bit floating point coordinates for large levels (next topic).
# 64bit floating point coordinates & 64bit integer entity id conversion
As explained at the Introduction section of the presentation already, a 3D level has three dimensions: x, y and z. Therefore, each object in the game has three floating point values representing the coordinates in space. The position of an object in the level might be (x=5.12 | y=204.7 | z=-167.826). These numbers arent "tracking" the objects position, but are actually determining it.

__Challenges:__

* like most game engines the engine currently uses a floating point type with 32bits for these three coordinate values
* compared to 'integer' numbers, 'floating point' numbers can represent very large numbers by using 8bits as exponent and 24bits for the significand/fraction. With this math, the decimal point can be moved around, hence the name "floating point".
* however the downside is that large numbers lose precision therefore making it only useful for small game levels (~8km max) with sizes of a few kilometers because anything larger would result in more and more precision inaccuracies leading to movement being imprecise and stuttering more and more the further away an object is from the center of the level (x=0, y=0, z=0)
* additionally, with eventually thousands of players and probably billions of unique entities in the game over the course of the games lifetime, each entity in the game requires its own unique id; currently the 32bit value allows for 4,294,967,295 unique entities

__Solution:__ 64bit floating point coordinates (also referred to as Large Worlds) and 64bit integer entity identifierse

__Requirement for:__ Object Containers, zones, 64bit to 32bit converter

__Goals:__

* larger levels which can contain an entire solar system with its planets and locations

__Approach:__

* convert all coordinate values from 32bit to 64bit type (double-precision floating-point format) (Large Worlds)
* most of the game logic/code of objects/entities/components has to be changed for this conversion
* with this change, level size doesnt just double, it actually allows for MUCH larger levels (almost 9 billion of kilometers in size)
* for the entity ids, using an unsigned 64bit integer would allow for 18,446,744,073,709,551,615 unique entities which would definitely be plenty for many decades to come; having a global id for each entity in the game will make logic for server meshing much easier when entities are uniquely identified by all game servers
# ZoneSystem
### Challenges:
* since the game is going to feature a lot of moving and rotating entities (e.g. planets, spacestations, ships, public transport, other vehicles) a lot of objects inside all of those entities would have to update their position in the level as well
* objects can be inside of other objects thus objects would have to be moved multiple levels deep
* this would lead to a lot of computational load and has a high chance of leading to issues like movement and hitbox jankiness
* currently each code system (rendering, network updates, physics) has its own custom partitioning system some of which dont work well in these new large 64bit coordinate systems

__Solution:__ ZoneSystem and its Zones, a unified, custom spatial partitioning system (despite its name, it has nothing to do with zoning/instacing of game areas like many MMOs do)

__Requirement for:__ Object Containers, 64bit to 32bit converter, OCS, Server Meshing

__Goals:__

* allow for large groups of objects to move and rotate with little CPU computation required by introducing zones
* have these zones be a unified system for rendering, visibility occlusion, network optimizations, physics, level streaming, AI, etc.

__Approach:__

* this replaces the Octree datastructure previously used to partition the game level into cubic, immovable chunks
* the new zones can be of different sizes
* each planet, station, ship, room etc. receives its own zone and each zone has its own 64bit floating point coordinate system
* objects which are inside a zone are positioned relative to that zone, not to the level world coordinates
* if a zone moves, its coordinate system moves with it and that in turn moves all objects inside
* therefore, to move all objects inside of a ship/planet/etc., only the position of the ship ("zone host") has to be updated
* this makes large ships essentially its own moving level inside another even larger level
* zones can be nested, thus smaller zones can be in other zones and move with the parent zone like all the other objects, for example solar system->planet->landing zone->room->ship->vehicle
* those smaller zones can enter and leave larger zones (like the zone of a vehicle parked inside the zone of a ship)
* when objects move from one zone into another the object coordinates have to be correctly calculated to ensure a smooth transition from one coordinate system to the other
* initial work was done/completed in August 2014
* was changed to an AABB tree data strucuture in June 2016
* (speculated: it is highly likely that zones are going to be used for OCS and Server Meshing for networking, streaming and to partition the game world into sections to be run on separate game servers)
# 64bit to 32bit converter
### Overview
We now use 64bit floating point value coordinates to allow for large level sizes.

__Challenges:__

* however, GPUs are much more efficient when being able to use 32bit floating point values for their calculations when rendering images

__Solution:__ 64bit to 32bit converter

__Requirement for:__ Object Containers

__Goals:__

* have a 64bit world size to simulate the objects within and at the same time allow the GPU to use 32bit coordinates to render the game

__Approach:__

* therefore, a 64bit to 32bit floating point zone-to-world converter and a world-to-camera relative space converter were implemented that turns those 64bit world coordinates into 32bit coordinates for the renderer where the player camera is being placed at (0,0,0)
* other objects are then positioned relative to the player camera
* this assures that the precision directly around the player is very high; objects further away (like planets or moons) might be slightly mispositioned but that is barely noticeable at such distances

![Image](/images/64bit_to_32bit_converter/image-01.png)
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
# Entity Component Update Scheduler
### Challenges:
* for Client Object Container Streaming it will be necessary to load and unload entities and start and stop sending state updates to the client to reduce RAM and CPU usage so we require information on when we can do that

__Solution:__ Entity Component Update Scheduler (released in 3.0, most likely a result of the Simulation Multithreading initiative)

__Requirement for:__ Serialized Variable Culling, Client Object Container Streaming

__Goals:__

* update all entity components on each game tick in the game loop on the server
* provide information of the distance and visibility of each entity in regards to each player
* limit network updates to the clients based on those distance and visibility information

__Approach:__

* the Entity Component Update Scheduler already provides the required information about distance, size and visibility of entities in relation to the players
* since 3.0, the server already used that info to be able to start and stop simulating individual components as well as start and stop sending network updates to client of entities that are too far away from all (!) the players in the level.
* each Component type can be given a different update policy for more fine control when they should be simulated/networked
* This already saves performance as not all entities are simulated and send network updates to the clients.
* However, this still sends entity updates to ALL clients if only a single player is near an entity, even tho other players might be far away from that entity (this was later changed with the Serialized Variable Culling feature)
* these network policies will play a vital role in server meshing to ensure player clients perform well when hundreds of entities are around a player by skipping network updates for far away entities (where such skips are noticed less) thus reducing load on the client CPU
* speculated: interpolation techniques might allow far away entities to still have smooth motion, even though their state might not be 100% accurate all the time
* for OCS, the Entity Component Update Scheduler will be used for the loading and unloading of entities because it already provides the required information about the distance, size and visibility of entities to the players
* The ECUS was updated in Alpha 3.17 improving the simulation performance greatly (made it entity-centric, use Zone Host Updates and more).
# Entity Ownership Hierarchy / Entity Aggregates
### Overview
At level design time, Object Containers can be nested to create larger game areas out of smaller objects. However, there needs to be additional logic at runtime. Some entities are made up of smaller entities. And how these are made up can change while playing.

__Challenges:__

* These entity groups need to be represented in memory.
* These groups and hierarchies can cause issue when these objects are not loaded/unloaded in the correct order.

__Solution:__ Entity Ownership Hierarchy / Entity Aggregates (released in Alpha 3.0) (speculated: scene graph)

__Requirement for:__ Entity Spawn Batches & Entity Snapshots, Client Object Container Streaming

__Goals:__

* It is required to keep track when those dynamic groups are formed or disbanded.
* Load and unload groups of entities in the correct order (e.g. the ship exterior needs to be loaded before the ship interior, as the inner ship's state partially defined by the outer ship)

__Approach:__

* A group of entities - which are related to each other and form a larger entity - are called an Entity Aggregate (or Entity Root or Logical Entity). Examples:
* A weapon is the entity root and its attachments are entities attached to the weapon.
* A player character (entity root) picks up an item and holds it in its hand and moves around with the player.
* Entities can move in and out of each other, like ships and vehicles moving into other ships (speculated: therefore, this might be related to the zone system)
* How entities are related to each other is kept track in an Entity Ownership Hierarchy.
* Together with the Entity Component Update Scheduler, the server decides which Entity Aggregate(s) to load and unload on each client (by sending the equivalent Object Containers and Entity Snapshot updates).
* In the EntityGraph database, entities that are Entity Roots are labeled as such on the node (for queries).
# Entity Spawn Batches & Entity Snapshots
### Overview
With the server now being able to notify the client to load entities into memory it was time to handle the loading part on the client.

__Challenges:__

* entities need to spawn in a consistent way on the client so that client and server end up with the same Entity Aggregates and Entity Hierarchy in memory

__Solution:__ Entity Spawn Batches & Entity Snapshots (released in Alpha 3.0)

__Requirement for:__ Client Object Container Streaming

__Goals:__

* handle the data send by the server on the client to load objects in the correct order into memory

__Approach:__

* the server groups entities which should spawn together into an Entity Spawn Batch
* the entities only become active (being computed in the game loop) once all entities in the batch are loaded
* for each entity, the server creates an Entity Snapshot (with the help of Serialized Variables) containing the entire state (all variables and their values) of the entity and sends it to the client (speculated: maybe just those that are non-default values)
* while the entities are being loaded they are not being networked yet to stay synchronized. The process of loading objects in the background takes time which can lead to the object state being different on the server and client. This is solved by the server sending a second Entity Snapshot once all entities are loaded. The client updates the state to be in line with the server and then the entities can become active and networked to stay in sync with continuous updates from the server
* Since networking can be started and stopped (thus network updates skipped) for individual entities any time, entities are not necessarily unloaded directly when they dont receive updates anymore. They might stick around in memory for a while and continue receiving updates again later. Then a Entity Snapshot is send again to ensure the entity has the right state.
# Serialized Variable Culling
### Overview
Thanks to the Entity Component Update Scheduler, the server was already able to skip updates of certain entities when they are far away from the players.

__Challenges:__

* however each client was still send all updates of all entitiy around ALL players and thus had to update their components when new network information was received from the game server
* this put unnecessary load on the client CPU by having it compute objects in far away places (at the time the in-development Persistent Universe consisted of Port Olisar, Levski and GrimHEX and players could already be far apart)

__Solution:__ Serialized Variable Culling (released in Alpha 3.1)

__Requirement for:__ Client Object Container Streaming

__Goals:__

* only send updates of the entities which are in near proximity of the player to that specific client
* for the first time, it allowed CIG to run the client on partial information about the game world running on the game server

__Approach:__

* utilize the already created software systems (mainly the Entity-Component-Update-Scheduler and likely its networking policies) to determine which client requires which object data
* put a system in place that will only send network updates to the client that is in the near proximity of the updated entity
* now each client only receives the information that that specific client requires, reducing the load on the client CPU
# Network/Entity Bind Culling
### Overview
With Serialized Variable Culling each client only received network updates of entities which are near that player.

__Challenges:__

* however, the player still had to load all entities on level start and keep them loaded in memory even if they were far away and not being networked

__Solution:__ Network Bind Culling (released in Alpha 3.3, also referred to as Entity Bind Culling later on)

__Requirement for:__ Client Object Container Streaming

__Goals:__

* load and unload entities to/from memory on the client based on the position position in the level

__Approach:__

* the server tells the client when to load which entities into memory (by using the Object Containers and their identifiers)
* entities are loaded based on the information provided in the Entity Component Update Scheduler
* we are finally at a position where the client has a truly partial view into the game world on the server, completing the functionality of Client OCS
* the game world on the server could now be increased, adding more locations, without requiring clients to load them into memory as well
# Ship Interior Object Container Streaming
### Overview
__Solution:__ Ship Interior OCS, an additional feature for OCS to further optimize clients and servers

__Goals:__

* "When complete, streaming interior object containers in and out of ships based on distance will allow vehicles to have a higher performant stage of streaming used at far distances, to reduce CPU cost." - Release View
* reduce CPU and memory on client (and servers in server meshing)

__Approach (speculated):__

* split the exterior and interior of ships into separate Object Containers
* add additional OCS rules for loading and unloading rooms/zones and/or Object Containers of the ship interiors
* the player client does not have to load the interior of far away ships anymore
* speculated: in server meshing, a game servers doesn't have to load the interior of the ships, which are being computed by another game server in the mesh/shard
* speculated: rooms with windows may need to have a different rule compared to rooms which are deeper inside of ships
# Long Term Persistence
### Overview
So far, every three months on each major patch the player progress is completely wiped because the database was reset.

__Challenges:__

* players dont have a lot of incentive to work toward ships and other items (especially ever since in-game ship purchases and rentals came available) because they will be removed again every three months

__Solution:__ Long Term Persistence (LTP, Platform Persistence, "Baby Persistence"), later reworked and renamed to 'Global Database'

__Goals:__

* Implement a first version of persistence for player account data.
* (note: this feature is not Full Persistence because Full persistence is about saving data of the game world which is what PES and the EntityGraph database is going to do)

__Approach:__

* The first version released in Alpha 3.8.2 with:
* aUEC balance
* Ship purchases and rents
* Ship component purchases
* FPS item purchases
* This allowed the introduction of the currency trading app (mo.TRADER) in Alpha 3.10.0 by utilizing the database that stores the information about the players aUEC balance.
* This database now saves in-game purchases of ships to allow players to work toward and keep their ships across multiple patches.
* "As of [Alpha] 3.15, Long Term Persistence is broken up into three distinct parts: Items, Wallet (aUEC), and Reputation. Going forward, we will be able to wipe specific parts of LTP individually as needed (for example, wiping Reputation while leaving Wallet and Items intact). This level of flexibility will allow us to do necessary wipes while minimizing the impact on the community."
* The Item part of the database is most likely the Global Database holding inventory items of a player across shards.
* Alpha 3.15 also came with an interim implementation for Server Crash Recovery specifically for ships. This was done by checking the Replication Layer cache (containing a snapshot of the physicalized ship entity of the crashed server) for all player ships. Those ships are then stowed into the Global Database (LTP). From there, it then can be spawned again on any server at a ship terminal. The interior (including cargo) is spawned and available as well. This was a first workaround before the actual server crash recovery that will allow us to keep playing exactly where the game left us of (e.g. inside our ship while Quantum Travelling).
* Alpha 3.18 introduced multiple quality of life improvement, one of which being stacking of similar items and a "tranfers all" button.
* September 2024: Version LTP 2.0 worked toward with various improvements to persist more aspects across patches.
# Entity Streaming Manager & StarHash
### Overview
Without Server OCS, the entire game world was always loaded in memory on the server in the in-process database.

__Challenges:__

* there needs to be a fast way to query the database for objects in a certain area in the game world so that objects can be loaded around a player who is moving through it

__Solution:__ Entity Streaming Manager with on-drive database, StarHash and StarHash-RadixTree

__Requirement for:__ Server Object Container Streaming, iCache, Global Persistence, Static Server Meshing

__Goals:__

* make changes to the current in-memory database on the server to have it more in line with the requirements of persisting items in the game world

__Approach:__

* use a modified version of a Geohash algorithm usually used for map application to find points of interests around the users and call it StarHash
* make the Geohash 3D (xyz axis) instead of 2D (longitude & latitude) and use 64bit floating points for the coordinates
* when saving an object, generate a unique hash code based on the xyz positions of an object in the level
* to perform quick look-ups, the objects are indexed via a Radix Tree data structure (usually has a O(k) worst case look-up performance with k being the length of the hash code)
* when players move around in the level, the Entity Streaming Manager can now look up the database for all objects that exist around the players. Those objects are then loaded into memory, initialized and processed in the game loop
* this database system will most likely be used and expanded upon for the Item Cache databases and Server Meshing
# Definitive State & Location Spawn IDs
### Overview
With the entities not being loaded and accessible in server memory anymore, some issues arose because of it that needed to be deal with before Server Object Container Streaming was able to come online.

__Challenges:__

* in some situations, especially when players are teleported into an unloaded area (e.g. when (re)spawning), where everything has to be loaded, certain entities have to be loaded before others, like the floor before spawning NPCs, otherwise NPCs fall and are never seen again (this was not an issue for Client OCS because there the second Entity Snapshots from the server was able to adjusted the position of NPCs again and move it on top of the floor)
* some components that are only executed on the server were not yet unloaded to the database (because they previously did not need to since they always stayed in memory)
* when a player connects, its player entity is always spawned at a SpawnLocation which in itself is an entity but that leads to an issue because the system only loads all entities including the SpawnLocation entity when players are nearby (how the system is setup, SpawnLocations cant be an exception and excluded from the streaming process)

__Solution:__ lots of bug fixing and the introduction of Location IDs

__Requirement for:__ Server Object Container Streaming

__Goals:__

* fix the remaining issues caused by not having all objects loaded in memory at all times anymore

__Approach:__

* load world geometry and other objects in the correct order to have them loaded just like they were persisted
* finish work to be able to persist all components in the game
* to fix the SpawnLocation issue, a two phase spawning process was introduced: When a player connects it loads the players LocationID which essentially is just a point in space. It is used to spawn in objects at that point which includes the SpawnLocation. Once that is loaded, the player is spawned and the world loads around the player
# pCache
### Overview
__Challenges:__

* Before Server OCS, all entities are stored in the game engine memory. However, for persistence to come online, if the game server goes down, then all data in memory will be lost. Not ideal, for a game that aims to have a persistent game world where everything has to keep existing, even between game server reboots.
* Looking at the requirements under Server Meshing, multiple game servers will need to access the same game world data, and therefore this data needs to be made accessible to all game servers in a centralized place
* However, for now there only needs to be a prototype database backend put in place to bring the first version of Server OCS online and to figure out which requirements Full Persistence has.

__Solution:__ Persistent Item DB & pCache,

__Requirement for:__ Server OCS

__Goals:__

* Bring the first version of Server OCS online by creating a prototype a first prototype backend for persistence

__Approach:__

* Create the prototype persistence backend for Server OCS, using an in-memory database cache called pCache, which (speculated) connects the data to an on-drive database called Persistent Item DB.
* While running, the game server can now offload entities into the cache and database and load it again depending on where players are in the game world. This uses the SOCS functionality.
* This prototype solution used a relational database.
* This prototype was planned to be replaced by a proper and scalable database that would sit outside the game server. This was initially supposed to be iCache. However, the initial R&D continued working out a scalable solution using a relational database, but at the end of 2020 this turned out that it didnt provide the low latency and performance CIG were looking for. Starting 2021, they switched to a graph database instead, which showed results internally for the first time in Mai 2022, expected to come online with PES in the Alpha 3.18 patch.
# Global Database
### Overview
So far, every three months on each major patch the player progress is completely wiped because the database was reset.

__Challenges:__

* players dont have a lot of incentive to work toward ships and other items (especially ever since in-game ship purchases and rentals came available) because they will be removed again every three months

__Solution:__ Long Term Persistence (LTP, Platform Persistence, "Baby Persistence"), later reworked and renamed to 'Global Database'

__Goals:__

* Implement a first version of persistence for player account data.
* (note: this feature is not Full Persistence because Full persistence is about saving data of the game world which is what PES and the EntityGraph database is going to do)

__Approach:__

* The first version released in Alpha 3.8.2 with:
* aUEC balance
* Ship purchases and rents
* Ship component purchases
* FPS item purchases
* This allowed the introduction of the currency trading app (mo.TRADER) in Alpha 3.10.0 by utilizing the database that stores the information about the players aUEC balance.
* This database now saves in-game purchases of ships to allow players to work toward and keep their ships across multiple patches.
* "As of [Alpha] 3.15, Long Term Persistence is broken up into three distinct parts: Items, Wallet (aUEC), and Reputation. Going forward, we will be able to wipe specific parts of LTP individually as needed (for example, wiping Reputation while leaving Wallet and Items intact). This level of flexibility will allow us to do necessary wipes while minimizing the impact on the community."
* The Item part of the database is most likely the Global Database holding inventory items of a player across shards.
* Alpha 3.15 also came with an interim implementation for Server Crash Recovery specifically for ships. This was done by checking the Replication Layer cache (containing a snapshot of the physicalized ship entity of the crashed server) for all player ships. Those ships are then stowed into the Global Database (LTP). From there, it then can be spawned again on any server at a ship terminal. The interior (including cargo) is spawned and available as well. This was a first workaround before the actual server crash recovery that will allow us to keep playing exactly where the game left us of (e.g. inside our ship while Quantum Travelling).
* Alpha 3.18 introduced multiple quality of life improvement, one of which being stacking of similar items and a "tranfers all" button.
# EntityGraph
For the state of the game world universe to be persisted within a meshed server environment, all entity data needs to be stored in such away that they become accessible to all game servers in a responsive, low-latency manner.

__Challenges:__

* With each game server accessing its own in-memory pCache database, actual persistence of dynamic entities is barely existent.
* The current pCache database does not support the functionality for full persistence yet, e.g. items which are just laying around on the ground, as well as this information needing to be accessed from multiple game servers under Server Meshing.
* The first database used internally was a relational one, but this was not performant and low-latency enough (This was iCache/Item Cache).

__Solution:__ EntityGraph, a NoSQL graph-based database and scalable query services for persisting and retriving entity state

__Requirement for:__ Persistence, PES, Physicalized Items and Inventory, Server Meshing

__Goals:__ Use a horizontally scalable and shardable database and create a scalable service layer that can persists all entities in the game world and serve all game servers in a performant and thus responsive way (and allow for full crash recovery down the line)

__Approach:__

* This is the successor/replacement of the initially planned and internally implemented and tested, but unperformant iCache implementation.
* Create a horizontally scalable fleet of services and use a graph database (both together or on their own referred to as "EntityGraph") which persist entity data and allow requests to be send from other servers, translate those into a DB query, retrieve and transform the response data:
* Improves the response times for backend database requests.
* Uses best practices for fault tolerance and recovery via data replication and automatic regeneration in case a database instance crashes.
* This should also help reduce the load on each individual database instance, as data can be replicated/sharded onto separate DB instances.
* The database instances and the services in front of the database can be scaled freely, independent of game servers and shards.
* EntityGraph is a graph database: the entities in the game world form a large hierarchy which can be represented as a directed acyclic graph data structure:
* EntityGraph uses SST file formats on disk to store the data.
* Each entity/game object in the game world is represented as nodes in the database, while relationships between entities are edges.
* Changing state of individual entities as well as changing relationships by adding or deleting edges are both cheap/fast operations in a graph database.
* Allows entities to be queried based on shard, star system, xyz position, object size and distance to players, entity type and custom labels.
* While playing, entities can form Entity-Aggregates which are streamed-in together. They can also be given a label which allow queries to request specific types of entities to be returned.
* With full persistence every entity anywhere in the level can be persisted, not just in pre-determined places such as weapon racks.
* Speculated: EntityGraph databases uses ArangoDB.
* Introduces Characters Repairs (instead of Character/Account Resets) as well as Entity Lifetime for Item Cleanup logic.
# Global Persistence
### Overview
With the EntityGraph and Global Database, we are provided a centralized place for all game servers to access entity data.

__Challenges:__

* The game servers still access the data in the old pCache database, not the new EntityGraph one.
* The databases and how data is stored changed a lot so a new way of querying the data is required.

__Solution:__ Global Persistence, which makes Server OCS utilize the new cache/EntityGraph and Global Database, of which a first version came online with Alpha 3.15 to enable persistence.

__Requirement for:__ Physicalized and Persisted Items and Inventory, Replication Layer, Static Server Meshing, Squadron 42

__Goals:__

* Let the game servers utilize the entity and inventory data stored in the EntityGraph and Global Database (LTP).
* With the state of entities being persisted long-term, more gameplay that utilizes the functionality of items existing in the game world long-term in the game world will be implemented and introduced into the game.

__Approach:__

* Change/extend Server OCS with this new functionality.
* This is the interface between the game server and the database(s) (and services and caches in front of the databases).
* Initially developed for iCache, parts of its implementation was reused and adjusted to work with EntityGraph and the new PES architecture.
* Speculated: While players move through the game world, the Replication Layer asks an EntityGraph database, if there are any entities in the area around the player.
* Let the Replication Layers cache and the game server load those entities into memory via Server OCS and on the game server start simulating them in the game update loop by the CPU.
* When players leave an area, serialize and send the entity state to the EntityGraph database (or Global Database in terms of Inventories and ships) to have it be saved and persisted.
* Unload the entity from memory to make room for new ones which is already part of Server OCS capabilities.
* The Replication Layer might periodically persist the state of entities to prevent data loss on a server crash.
* This functionality will also be used by the singleplayer game Squadron 42 to access the local offline database.
# Local, External & Personal Inventory
### Overview
The first versions of inventory and item management will consist of a personal inventory (what the players can carry directly on them), external inventory (e.g. a cargo box or backpack) and local inventory (ships and landing zones). The local inventory is going to be an intermediate version toward fully Physicalized Items and Inventories. Items will initally be stored on ships in these local inventories and accessible via UI. Through iteration, more and more items will be physicalized as "real" objects which take up space in the game world and the local inventories will be phased out. At the same time more physicalized inventories will be introduced that will allow players and NPCs to store these physicalized items directly inside physical inventories.

First version came onlinein Alpha 3.15.

# Physicalized Items and Inventory
### Overview
With the cache in the Replication Layer we have a centralized place to store all entity data and with Global Persistence the game servers are able to utilize that data.

__Challenges:__

* items are still very simple in their design and how the player can interact with them
* character inventories are still very simple in their design because they are merely global account inventories

__Solution:__ Physicalized Items and Inventory, first version came online with Alpha 3.15

__Requirement for:__ Persistent Streaming, Static Server Meshing

__Goals:__

* have items and inventories be physical objects in the game which take up space
* have items physically present in inventories when you open them (e.g. cargo boxes)

__Approach:__

* items will be a physical, interactive object in the game
* that even includes stuff like character clothes (with the Cloth Simulation implementation)
* even inventories are going to be physical items in the world, e.g. backpacks and cargo containers which can be put on the ground, moved around and picked up again (utilizing the Grabby Hands implementation)
* allow items to have child items
* allows the player to put items into other items, e.g. a battery into an electronic device (with Item Ports)
* allows hierarchies of nested items (bullets -> magazine -> gun -> backpack -> player)
# Stow & Unstow
### Overview
With physicalized items and inventories making its way into the game there needs to be a way to reliably persist and access such information, even if players switch between game instances/shards.

__Challenges:__

* Entities that physically exist in the game world (items) have to be be put into inventories (stowed) and later taken out again (unstowed)
* Both items and inventories need to be persisted. The physicalized items and physicalized inventories in the game world are going to be persisted in the EntityGraph database. However, the non-physicalized items inside of inventories are not persisted into the EntityGraph and into the Global Database instead.
* That is because items in inventories need to be accessible across Shards in Server Meshing, but EntityGraph only groups data per-Shard.

__Solution:__ Stow & Unstow, communication between the EntityGraph and Global Database

__Requirement for:__ Personal Inventories, Persistent Entity Streaming, Static Server Meshing

__Approach:__

* When items are stowed into inventories, they stop existing as physicalized items in the game world and instead as an entry inside the inventory. The contents of inventories are then persisted into the Global Database (LTP), instead of the EntityGraph database.
* This allows players to access inventories content (like local and personal inventories), even if they switch to another game instance (or another shard under Server Meshing), since the Global Database stores Shard-independent data.
* Items can be easily moved between inventories. In the database this would be unstowed from the first inventory and directly stowed into the second inventory (most likely a single database transaction).
* Ships - and all items inside - can also be stowed into the Global Database when the ship is stored (e.g. by the player via a terminal) and later spawned/unstowed again
* this allowed for the first introduction of a rudimentary Ship Recovery in the case of a Server Crash (see Global Persistence/LTP for more info).
* Besides stow and unstow, there are even more DB commands, some of which are create, possess, transfer, stack, unstack, change location, change snapshot and bury.
# Shards
### Challenges:
* Because the backend architecture is getting more complex once moving toward Server Meshing, there needs to be new terminology.
* So far, an entire game world has been simulated by just a single game server.
* Under PES and Server Meshing, players won't play on and send/receive data directly from a single game server anymore, a game world is not referred to as a 'game server' anymore.

__Solution:__ Shards

__Requirement for:__ PES, Server Meshing

__Goals:__

* use the term Shard to refer to a (meshed) "game world" (one copy of the Star Citizen universe)
* sometimes the backend servers and services running one such game world is also referred to as the "Shard"

__Approach:__

* Idealy, everyone plays in the same game world, a single world-wide Shard.
* However, until Server Meshing is capable of doing that, there will still be multiple, independent shards running alongside each other, each with their own game world and state. Therefore, initially there will be a multiverse of SC universes, but economy is shared (via the StarSim Economy Simulator).
* The initial milestone/goal is to scale up Server Meshing far enough to support one Single Sshard per region.
* While playing, players and entities can only ever be transferred between game servers of the same Shard, never to server nodes of a different shard.
* Players can still join/switch to another Shards, but this can only happen from the main menu before they start playing, determined by matchmaking/login-flow
# Server Nodes
### Challenges:
* Because the backend architecture is getting more complex once moving toward Server Meshing, there needs to be new terminology.
* A single Game Server won't simulate the entire game world once Server Meshing comes online.

__Solution:__ Server Nodes (sometimes still DGS, Dedicated Game Server, or simply still game server)

__Requirement for:__ Server Meshing

__Goals:__

* Game Servers become a horizontally scalable service, meaning multiple game servers can run alongside each other, simulating the same game world (Shard)
* Server Nodes do not perform Replication (and persisting into a local in-memory database) anymore, as this is moved out of the game server and into the Replication Layer (see topic)

__Approach:__

* Server Nodes are still Game Servers (DGS). As before, they are responsible for simulating the game world, verifying the actions of the players and simulating AI. The difference is that now a specific Server Node might only a part of the game world, and not the entire game world anymore.
* There can be many server nodes computing the same game world. The term server 'node' highlights that it is one of many game servers in a much larger network and those nodes having been setup to work within it.
* To determine which Server Node is computing which part of the game world, a Server Node will be assigned authority (from Atlas) over the entities in that section of the game world. The code logic known as Entity Authority will then perform the correct action on the server, depending on if that server has authority or not (or is about to gain/lose authority when authority is transferred and entities are simulated by another server node afterwards).
# Player Item Shard Transitions
### Overview
__Challenges:__

* Because there will be a large time frame in which we still have multiple game worlds running alongside each other, the multiverse, (because Shards cant be scaled up high enough to support single regional Shards or even a single world-wide Shard), there is a need for players and their items to move between Shards.

__Solution:__ Player Item Shard Transitions

__Requirement for:__ Persistence

__Goals:__

* be able to move game objects - that were freely placed in the game world - between Shards when the player switches to a different Shard

__Approach:__

* "With the introduction of fully persistent shards, items/ships that are left “in the open space” are bound to that shard until a player collects them and stores them into an inventory or parks a ship at a landing location. In order to provide a more frictionless experience we will implement a feature that automatically stores these ‘freely placed’ items from the shard when areas are streamed out, and places them into a different shard when the player logs into a new shard. This allows players to find their freely placed ships/items that are left in the open space regardless of which shard instance they are assigned during login." - Roadmap Deliverable
* Data in the Global database (stowed items) does not have to be transfered like this as it is already Shard-independent (meaning, it is available to all shards). This moving data between GlobalDB and EntityGraph is a different functionality (Stow & Unstow) which has come online with Alpha 3.18, but has nothing to do with Player Item Shard Transitions.
* CIG has talked about ideas on how to handle land claims and bases under the multiverse; They would exist across all game worlds, but in an inactive state except in the shard in which the owner plays on.
* Speculated: Since around ~2023/2024 (around the introduction of the PES, still need exact date) we are able to bedlog with our ships in interplanetary space. When logging back in later, we might have joined a different shard, but our ship is respawned in the same place we left it when we logged out. This means the ship is being moved between shards, making this a form of Player Item Shard Transitions (not confirmed by CIG themselves, but on a technical deduction from my end). This works by automatically storing the ship into the Global DB from which it can be loaded and spawned again in the same place on a different Shard.# Game Server Crash Recovery & Client Reconnects
### Overview
EntityGraph and the Replication Layer will allow for the recovery of crashed servers and reconnets of disconnected players.

__Challenges:__

* a server crash would cause major disruptions for the player experience
* especially under Server Meshing you need to be able to restart individual servers instead of having to restart the entire meshed system, which essentially would be all servers if just one server crashes

__Solution:__ Game Server Crash Recovery and Client Reconnects

__Requirement for:__ Server Meshing

__Goals:__

* utilize the data stored in the EntityGraph to recover individual, crashed game servers and allow players to continue to play with minimal interruption and barely any loss of player progression and items

__Approach:__

* Alpha 3.15 came with basic crash recovery for ships by showing player ships into the Global Database (LTP) on server crash. From there, it then can be spawned again on another server by the player at a Terminal with the cargo fully available. This was a first workaround before the actual server crash recovery that will allow us to keep playing exactly where the game left us off (e.g. inside our ship while Quantum Travelling).

With 3.23.0 onwards, on a game server crash a new server will be started to take over its job:

* The new game server loads the entities (which the crashed server was responsible for) from the Replication Layer
* The new game server utilizes Server OCS to load these entities into its memory
* The Replication Layer holds the player client connections in the meantime and once the new server is ready to go, the game will continue to simulate for the players. A wait time is and teleporting of entities may be experienced by the player.
* Players will only experience a few minutes of disruption and lose barely any of their progress as most of the data is already persisted in the EntityGraph instead of the crashed game server/server node
* The Replicant and Gateway services are expected to become rather stable (because they dont run complex code, such as the server nodes). Even if one of these services goes down, it is expected take less than a minute for the Relicant and just a few seconds for the Gateway service to be started and the game to be resumed.
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
# Service Fleet Manager
### Overview
For Server Meshing to come online, there needs to be a manager for all servers and services of a Shard. This is going to be the job of the Fleet Manager (part of Shard Manager?). It is going to start and stop services and servers, statically initially, later dynamically under Dynamic Server Meshing. It is already developed with that dynamic functionality in mind.

This is already implemented with having horizontally scalable servers and services in mind, which becomes more used under Dynamic Server Meshing.

__Note:__ This has nothing to do with ship fleets. This is about fleets of services/servers.

# Shard Manager
### Overview
__Challenges:__

* a Shard does not consist of a single game server anymore, but multiple servers and services. All of these have to be managed somewhere.

__Solution:__ Shard Manager

__Requirement for:__ Server Meshing

__Goals:__

* manage all the servers and services of a Shard
* setup all relevant data to have the Shard work properly

__Approach:__

* Responsible for setting up a new Shard
* by first starting and managing server nodes & services (Fleet Manager?)
* establishing network connections between services and server nodes
* "seeding" the EntityGraph database with the initial state of the universe (kind of like a "big bang" for that specific SC universe), creating a new game world.
* registering the shard at the Matchmaking service to let players join that Shard.
# Replication Layer
### Overview
__Requirement for:__ Persistent Entity Streaming, Static Server Meshing

__Solution:__ Replication Layer (sometimes also called Hybrid service, since the Replication Layer will eventually be moved onto its own server, together with many more services, before all those are moved onto separate scalable servers again, see Replication Layer V2)

__Goals:__

* Create a new service that is going to sit in-between the player clients, game servers and the EntityGraph database and is responsible for OCS loading decisions, state networking, caching, persisting and initial game world seeding.
* Have this service run alongside the game server to get all this functionality online before moving it on its own server for Server Meshing (at which point the Replication Layer is called the Hybrid Service).
* This decouples the Replication/Networking of the (persistent) entity state from the simulation (game servers).

__Approach/Goals:__

* Instead of exchanging data directly, clients and game server(s) will communicate via the Replication Layer instead. The Replication Layer will relay the information to the clients and game servers that need it.
* The service has been rolled out in phases:
* In Alpha 3.13 or 3.14, a first version of the Replication Layer might have come online, mainly moving code around in the engine code to prepare for later features.
* Alpha 3.15 came online with an in-memory cache which introduced a new query system as well as inventories (including stow/unstow, utilizing the Global Database and the Global Persistence features, but not EntityGraph just yet).
* For Alpha 3.17, the OCS logic that is responsible for loading the game world was moved out of the game server code and into the Replication Layer code. It also came online with improvements to the OCS streaming bubble, allowing clients and servers to load the same entities in parallel and have different streaming bubble sizes for clients (prior they had the same size and the client was only notified after the server completed loading on its side). The entity state networking part of OCS might have been moved into the Replication Layer with Alpha 3.17 as well.
* With Alpha 3.18, the EntityGraph database is hooked up to the Replication Layer (PES comes online for the first time).
* With Alpha 3.23, the Replication Layer was split off from the game server and moved onto its own server instead, enabling Server Crash Recovery.
* Under Dynamic Server Meshing, the Replication Layer will be horizontally scaled, by splitting off the individual services it consists of, so that they can be scaled independently, serving many more clients and game servers. This is how Server Meshing is going to scale up and allow for more and more players in the same game world/mesh/shard.
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
# Entity Zones
### Overview
__Challenges:__

* Speculated: Figuring out which entity should be simulated on which game server on a per-entity basis might not be efficient enough or even necessary.

__Solution:__ Entity Zones (initially maybe referred to as "Territories")

__Requirement for:__ Server Meshing

__Goals:__

* Use a spatial partitioning datastructure to group up entities for bulk authority assignment.

__Approach:__

* Split the game world into separate sections/zones, grouping up all the entities within.
* Use the existing ZoneSystem to form these separate sections, called Entity Zones.
* Instead of assigning individual entities, these Entity Zones can be assigned to the game servers of a mesh.
* When assigned to a game server, ALL entities within an Entity Zone are then computed by that game server (However, Dynamic Server Meshing V2 will optimize this further).
* Under Static Server Meshing, Entity Zones are assigned only once at initial shard setup and stay on that game server.
* Under Dynamic Server Meshing V1, Entity Zones can be reassigned anytime to another game server.
* Under Dynamic Server Meshing V2, an Entity Zone can be even further subdivided. These additional sections are called "simulation islands". They too can then be assigned to separate game servers.
# Replication/Replacement Message Queue (RQM)
### Overview
__Challenges:__

* Once many game servers are in a mesh, the message queues of the Replication Layer and game servers are flooded with too many messages. This was identified in the Tech Preview Playtest in mid 2024.
* If the Replication Layer can't process the messages fast enough, then the queue will fill up more and more, which eventually leads to messages waiting a long time before they are being processed and send to their recipients.
* One of the causes for this is the fact that both game state changes and OCS loading notifications are put into the same queue. This lead to issues when many players join or left the game and lots of areas had to be loaded/unloaded.

__Solution:__ Refactor the Message Queue

__Requirement for:__ Server Meshing

__Goals:__

* Allow higher bandwidth of data by preventing the message queue to fill up and avoid the delay it causes.

__Approach:__

* Refactor the existing Networking Message Queue (NMQ) into the updated Replacement/Replication Message Queue (RMQ).
* Allow for better parallelization, optimize handling of "dirty variables", optimize OBS binding logic.
* Speculated: May have also split the queues into separate types of queues. One for game state changes (for real-time processing) and OCS loading notifications (not as much of an issues if a lot of notifications are in the queue).
* This was tested in Alpha 3.24 (with utilizing AB Testing at the beginning of the patch before it was rolled out to all Shards)
* This was tested again in the Server Meshing TechPreview Channel Playtests starting September 2024. Other causes for high delay were identified.
# Atlas
### Overview
Atlas is one of the components of the initial Hybrid Service, but will be its own scalable service later on.

__Challenges:__

* Entity Authority introduced the functionality of game servers/server nodes to be able to compute only specific entities of the level rather than the entire level by default.
* However something needs to keep track, determine and assign this authority to the server nodes.

__Solution:__ Atlas service

__Requirement for:__ Server Meshing

__Goals:__

* Create a service that manages the Entity Authority for the server nodes/game servers of a Shard/Mesh.

__Approach:__

* Atlas determines and keeps track of which server node has authority over which entities.
* The game world is going to be split into separate sections with the help of Entity Zones (Zone System).
* Under Static Server Meshing, these Entity Zones are assigned to game servers on initial shard-start and stay fixed/unchanged afterwards (meaning statically assigned).
* Under Dynamic Server Meshing, these Entity Zones can be re-assigned to different game servers on-demand any time (meaning dynamically assigned).
* Atlas tells each game server/server node which entity it has authority over. After that, the Entity Authority logic on the game server is responsible for executing the correct logic on the entity state (run the simulation code for that entity or not).
* Authority can be transferred from one game server to another. E.g. when players and entities (like a ship) move through the level and from one Entity Zone into another (simulated by different game servers). In such a case, both game servers might already have the entities loaded into memory to allow for a seamless transition.
* Speculated: this is going to be expanded upon and turned into the Loader Balancer for Dynamic Server Meshing which will try to optimally distribute entities across all game servers continuously on-demand.
# Replication Layer & Replicant Services
Replicant is one of the components of the initial Replication Layer/Hybrid Service but will be its own scalable service later on.

__Challenges:__

* communication between clients and servers has to be scaled up to support more of both in the same shard

__Solution:__ Replicant component, Replication Layer with horizontally scalable Replicant Services

__Requirement for:__ Persistent Entity Streaming, Server Meshing

__Goals:__

* make the streaming and networking logic scalable for more clients and servers
* have clients/servers partially look into multiple game servers in a performant way
* allow for server recovery and client reconnects feature
* provide a cache for entity state from the EntityGraph database for the clients and server nodes

__Approach:__

* Parts of the entity networking and OCS logic of the game server is being moved into their own service called the Replicant.
* The servers nodes and player clients don't connect and communicate directly anymore, but instead via the Replicant service (as well as the Gateway service).
* The Replicant will be turned into a horizontally scalable service as well, where each Replicant (with its server nodes) handles a different section of the level. Together, they will form the Replication Layer.
* The Replicant includes partial logic of the Entity Component Update Scheduler (ECUS), as well as - speculated/deduced - the StarHash (Starhash Bind Culling) logic of the Entity Streaming Manager, Network Bind Culling and Serialized Variable Culling. Together, they will:
* Manage loading of Object Containers for both client and server (Network Bind Culling, Entity Streaming Manager, StarHash Bind Culling)
* Replication of networked entity state between clients and server nodes (ECUS, Serialized Variable Culling, StarHash Bind Culling)
* As well as persisting entity state changes into the EntityGraph database (Persistence, Persistent Streaming)
* Note: the Replicant does not run code related to game logic, like simulation or physics (as that is the job of the server nodes).
* This allows for the following new functionality:
* Now, game servers won't have to figure out which Object Containers have to be loaded/streamed on both the game server and clients anymore. Instead, the Replicant will figure this out and inform the server nodes and clients instead (and both can load the same entities in parallel which also allows server and clients to have different streaming bubble sizes).
* The server nodes are able to directly send their network updates to the Replicant service once, which then determines which entity states should be send to which client(s) (and maybe other server nodes in the shard) that need it. This would make the Replicant be a mediator and sit between the server nodes, clients and databases.
* The Replicant operates event-driven (not tickrate-driven like game servers), meaning that it directly processes network updates when they are received.
* Additionally, each Replicant contains a cache (in-memory database, iCache) in which parts of the data from the EntityGraph database are copied into. This allows quicker read and write access to entity state data. The Replicant persists its entity state back in the EntityGraph database, so that not a lot of data will be lost in the case if a Replicant crash.
* The Replicant component may have come online in Alpha 3.17 as part of the Replication Layer already.
* The Replicant service will be released once the Hybrid service is broken up (see Replication Layer V2).
# Gateway Layer & Gateway Services
### Overview
Gateway is one of the components of the initial Replication Layer/Hybrid Service but will be its own scalable service later on.

__Challenges:__

* communication between clients and server nodes (and Replicants) has to be scaled up to support more of both in the same shard

__Solution:__ Gateway component, Gateway Layer with horizontally scalable Gateway Services

__Requirement for:__ Persistent Entity Streaming, Server Meshing

__Goals:__

* distribute network updates between multiple clients and Replicants

__Approach:__

* While the Replicant service is responsible for distributing data between multiple server nodes ("server node facing"), the Gateway service is responsible for distributing data between the clients and the Replicant services ("player client facing").
* Clients dont connect themselves directly to server nodes anymore nor to the Replicants, but to Gateway services instead.
* The network state updates send from the player clients will be relayed to the correct Relicants by the Gateway services.
* Likewise, the server nodes send their network updates to the Replicant which will then relay it to the relevant Gateway service(s) that need this data. The Gateway service will then relay/replicate this data to the clients that need that specific data.
* Clients might be communicating with multiple Replicants at the same time by having the Gateway establish connections to multiple Gateways at once, exchanging network updates between all of them.
* Highly speculated: When the Gateway service receives network updates from a client, it directly sends it to the clients that require it. It also sends those network updates to the Replicant services that require it, which will relay it further to their server nodes that require it.
* This might allow for low-latency communication between clients, as well as allowing the server nodes to verify player actions and sending validation/rollback updates back to the clients shortly after. Actions already performed on the clients will be rolled back if the server node concludes a different outcome for the player action.
* The Gateway (just like the Replicant) operate event-driven, meaning that they directly process network updates when they are received.
* The Gateway component may have come online in Alpha 3.17 as part of the Replication Layer already.
* The Gateway service will be released once the Hybrid service is broken up (see Replication Layer V2).
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
# Hybrid Service (Replication Layer Split)
### Overview
__Challenges:__

* for all of the Server Meshing functionality to come online, the newly created services have to come online.
* with such complex interconnected services and infrastructure, the complexity is quite high.

__Requirement for:__ Static Server Meshing

__Solution:__ Hybrid Service (sometimes referred to as the Replication Layer Split or (wrongly) synonymous as Replication Layer)

__Goals:__

* create a new service that sits on its own server in-between the player clients, game servers and the EntityGraph database and is responsible for OCS loading decisions, state networking, caching, persisting, initial game world seeding and managing of entity authority and authority transfers.

__Approach/Goals:__

* Bring the new services called Atlas, Relicant, Gateway & Scribe online, but without the overhead of having to manage and coordinate all of these on their own servers already. And instead, reduce the complexity and infrastructure overhead for the initial versions by having all services run on the same server.
* While the mentioned individual services are planned to run on their own, separate servers later on, for the first version of Server Meshing it is easier to have them all on the same server, as the early versions will still be quite small in scope.
* Clients and game servers of a shard will connect themselves to the Hybrid service of that shard.
* Clients and game servers of a shard will exchange data and authority between each other via the Hybrid service which relays the data between all participants.
* For Dynamic Server Meshing, the Hybrid service is planned to be split up, and each services will be put on its own servers.
* Once that is done, the individual services are going to be horizontally scaled, so that e.g. multiple Replicant and Gateway services are running at the same time. This is how server meshing is going to scale up and allow for more and more players to play in the same shard.
* The Hybrid service consists of the Replication Layer logic (later Replicant & Gateway services).
* First version tested in a 3.21.X Preview Channel.
* It was released with 3.23.0 to Live PU, enabling Server Crash Recovery.
# Entity Authority Load Balancer
### Overview
For Server Meshing to become dynamic, there needs to be some kind of logic implemented that will automatically decide how authority over entities is distributed across the game servers. Because under Dynamic Server Meshing, game servers are not supposed to be assigned fixed locations to simulate, and instead are allowed to follow their players around, loading and simulating any part of the game world the players visits. The rule that only one game server is able to have authority over an entity still applies, so server-to-server communication can also happen anywhere in the game world, not just at the predefined borders, like under Static Server Meshing.

However, not a lot is known about this feature and in which form it will be implemented (e.g. utilizing a clustering algorithm).

__Speculated:__ This might also be the functionality of the Atlas service which might take over the role of not only keeping track of authority but also deciding how it should the game world should be split.

# Dynamic Server Meshing V1
### Overview
__Challenges:__

* With Static Server Meshing, the load can't be optimally balanced yet. Some game servers might be underutilized, others might be overloaded. This is also not efficient in terms of server cost, as underutilized game servers cost the same as optimially used and overloaded game servers.

__Solution:__ Dynamic Server Meshing Version 1

__Requirement for:__ Server Meshing

__Goals:__

* Re-assigned the Entity Zones on-demand anytime, even after initial shard setup.

__Approach:__

* Use the Entity Zones introduced with Static Server Meshing.
* Have an algorithm/heuristic check the load within each game server, then split the game world up into sections on-the-fly and re-assigned the different Entity Zones across the game servers of a mesh.
* Speculated: Might be the job of the Atlas services.
# Dynamic Server Meshing V2
### Overview
__Challenges:__

* Some Entity Zones might still become too crowded, especially mid- to large-sized ones.

__Solution:__ Dynamic Server Meshing V2, "Simulation Islands"

__Requirement for:__ Server Meshing

__Goals:__

* Allow the load of a single Entity Zone to be further distributed onto separate game servers.

__Approach:__

* Under Dynamic Server Meshing V2, an Entity Zone can be even further subdivided. The entities within the Zone are organized into different groups, "based on which objects can interact/collide with each other". These additional groups are called "simulation islands".
* This way, an Entity Zone does not have to be simulated by one game server, but can be simulated by multiple game servers, if the load demands it. This might especially necessary in highly crowded areas of mid- to large-sized Entity Zones.
# Replication Layer Version 2 (Hybrid service breakup)
### Overview
The components of the Hybrid services are going to be move out and into their own services. These services are going to be horizontally scaled, allowing multiple of these services to run alongside each other, allowing for more processing power and bandwidth. These services can then be spun up and shutdown dynamically based on demand. This is how Shards are going to be scaled up, allowing for more game servers and players per Shard to potentially reach one single shard per region.

For PES, there is the (Service) Fleet Manager service already in the works which is being designed with scaling game servers and services in mind.

# Specialized Netcode Research and Development
### Overview
To push Shards toward a potential world-wide Single Shard, additional research and development has to be done to mitigate the effects of high latency between services and clients when they are communicated across continental regions. Lag has to be compensated via netcode techniques and smart (re)location of services, requiring additional changes to the service architecture of Server Meshing.

# Server Node Multithreading Scaleup
### Overview
CIG plans to highly multithread their simulation so that a single server node can make use of more CPU cores and support more entities/players. This would reduce the total amount of server nodes required and might minimize the need for server-to-server communication as more entities could be put and simulated on the same server node.

There has been improvements made throughout the years. One major one might have been the improvements to the simulation logic by making the Entity Component Update Scheduler "Entity Centric" and Zone Host Updates and more in Alpha 3.17. Together with netcode improvements, it allowed for servers to utilize more cores, increaseing the number of players per server from 50 to 100+ in Alpha 3.17.2.

# Layers/Layering
### Overview

The term "layering" has ben mentioned and proposed for high population shards/servers in the 2021 Server Meshing & PES Q&A to help prevent overloading the clients with too much data from too many players. Other possible workarounds were proposed (such as closing jumppoints or AI blockading) but nothing definitive decided yet. Since there was no defintion provided we can only speculate it's meaning:

__SPECULATED:__ For scenarios where in-game areas are extremely populated by creating layers of an area (or an entire shard), meaning that multiple instances of that area/shard exist in parallel within the same shard. Although, it is unclear if this is limited to an area or if the entire game world/shard will be instanced. This solution might take into account friend and foe to put relevant interacting players into the same layer, potentially moving players more or less seamlessly between layers if needed. This would mainly be done to keep the performance on the side of the player client in check. The server side should be fine.

__OR:__ Players of different shards can meet up by layering areas of the game world.

![Image](/images/layers_layering/image-01.png)
# Projectile Manager
### Overview
Projectiles in the game are entities as well as an item from the new Item 2.0 (Entity Components) system which provides a lot of flexibility.

__Challenges:__

* projectiles are rather simple in design and computation but the overhead of being traditional entities introduced some issue that were especially noticeable once a very large amount of weapons were fired at the same time/game tick:
* Unnecessarily large memory usage caused by having to allocate the default but unnecessary entity state values
* By design, all spawning entities in the game are blocked until they are finished their spawning process which is not required when it comes to projectiles since they are too simple to be required to go through the entity spawning system. This became an unperformant congestion issue once many projectiles were spawned in the same game tick.

__Solution:__ Rework of the Projectile Manager

__Goals:__

* improve performance and reduce memory usage to allow for large numbers of simple projectiles in the game

__Approach:__

* on spawn, detect if the projectile is part of the basic projectile type
* then only create a tiny data structure to hold the necessary values of the projectile instead of a whole entity (very likely: on the code/memory side, it is implemented using a Structure of Arrays or Array of Structures of Arrays)
* in terms of rendering, each projectile is just a simple box with a material and wont be checked for occlusion culling (object not rendered because another object is in front of it blocking the view to the player) since they are already so cheap and not worth using up any additional computation for
* projectile are not network-replicated entities, meaning client and server dont exchange position data each game tick. Only the fire event (and hit event) of a projectile is networked, the position can then be calculated based on that information since the trajectory of a projectile is deterministic/always the same (this will most likely be used for server-to-server communication in Server Meshing as well)
# Actor Networking Rework
In the game code, an Actor is an humanoid or animalistic entity in the game which can be controlled by either a Player or by the AI and therefore 'acts' in the game world. Currently, actor movement is client-authoritative, meaning that if a player presses his 'W' button, the player client executes the appropriate action (in this case the player walks forward) and sends the new player position to the server which then sends it to all the other connected player clients to have the action replicated.

__Challenges:__

* can cause perceived lag and other players teleporting around especially when they have a poor connection to the server
* because the server does not validate the player actions, detecting certain types of cheating becomes more difficult to deal with since the client can just make up any player positions and the server will always consider that data to be correct
* for smooth actor movement and animations there is a 250ms delay injected as a workaround to compensate for lag spikes

__Solution:__ Rework of the Actor Networking ('netcode' for actor movement), split into two parts:

* Upstream: Client-to-Server, released in Alpha 3.6, barely any noticeable effects for players yet
* Downstream: Server-to-Client, functionality will become noticeable for players, slowly and continuously rolled out across a lot of the Alpha 3.x patches, major update and improvements for this in Alpha 3.17.2

__Goals:__

* make actor movement server-authoritative with client-side prediction (to clarify, this only affecting Actors that does not include ship and weapon networking, those will be separate features/deliverables, partially reusing some of the code)

__Approach:__

* the player client still executes the movement on its end but also sends a notification containing the pressed button (as an 'action') to the server. The server then executes the action on its side as well then compares its result with the result of the client. If they line up, then everything is okay. If they deviate, then the player client is notified and the position of the player is adjusted to what the server considers correct. This allows the server to validate all player actions.
* other players with bad connections wont teleport around anymore, but if you are the one lagging then you will be the one being teleported around (aka rubber-banding)
* the actor delay will be reduced to something reasonable (~66ms), with improve dead reckoning and state processing
* update: that delay has now been made dynamic, meaning that it will be lowered on low latency connections automatically
* Alpha 3.17.2 "Enabled new remote movement and new server authoritative position systems. With this update, players should see great improvements with on foot player positions and less jittery behavior while viewing remote player movements."
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
# StarSim
### Overview
A simulation run on a separate server which abstractly simulates thousands of simple AI (Quanta) as well as incorporate player and NPC actions to generate economy data, probability data and missions. All of this data is saved into databases which are then accessed by the game servers to display prices and populate the universe with appropriate objects based on the current state of the economy in that region of space. Also introduces dynamic events and Virtual NPCs to make the game world feel more alive and connected.

Released in its first version in Alpha 3.17 with Quanta generating the prices of quantum fuel, hydrogen fuel and repair services. However, in prior versions it was already used to manage and spawn dynamic events.

At the end of 2023 many StarSim features are hold back until the relevant gameplay systems have been implemented that properly utilize the functionality.

StarSim was initially called Quantum (Economy Simulator).



# Links

### Spectrum Post

Feel free to leave feedback here :)

[https://robertsspaceindustries.com/spectrum/community/SC/forum/3/thread/road-to-dynamic-server-meshing-tech-overview-with-](https://robertsspaceindustries.com/spectrum/community/SC/forum/3/thread/road-to-dynamic-server-meshing-tech-overview-with-)

### Community Hub Post

[https://robertsspaceindustries.com/community-hub/post/unofficial-road-to-dynamic-server-meshing-Pwb4hkkU75pnR](https://robertsspaceindustries.com/community-hub/post/unofficial-road-to-dynamic-server-meshing-Pwb4hkkU75pnR)


### Mobile View

[https://sc-server-meshing.info/wiki](https://sc-server-meshing.info/wiki)


### GitHub Source Code

[https://github.com/un0btanium/sc-server-meshing](https://github.com/un0btanium/sc-server-meshing)


### Support me on Ko-fi

[https://ko-fi.com/Q5Q6CF5CG](https://ko-fi.com/Q5Q6CF5CG)
