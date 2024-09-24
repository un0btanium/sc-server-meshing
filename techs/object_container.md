# Object Container
### Introduction
Our multi-step journey to Dynamic Server Meshing begins with the creation of Object Containers.

__Challenges:__

* traditional game levels consist of a list of objects (static and dynamic) which are loaded all on level start behind a loading screen
* to eventually be able to create a seamless universe with no loading screens and thousand of players, we can't load all objects into our memory all at once since the large amount of data would exceed our memory capacity

__Solution:__ Object Containers

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
