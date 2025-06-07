# Road to Dynamic Server Meshing - Preamble
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
