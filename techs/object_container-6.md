### Entity Components
Alongside the development of Object Containers, CIG also reworked the entire simulation code of the engine. They rewrote the code by splitting and reusing code pieces across multiple different object types.

An entity is not just a whole thing. It consists of many small behaviors and interactions, like physics, player health, movement input, etc. Each of these behaviors were put into their own Component. And thus there exists a PhysicsComponent, a HealthComponent, a InputComponent, etc. When a new entity is spawned, then the components of that entity are initialized and memory reserved to hold their state. The entity is therefore a composition of components.

In the code, these components can then be used on different entities, speeding up development and reducing bugs by not having to write or copy the same code over and over again into different object types. For example, player characters, ships and other items can all make use of the same PhysicsComponent, to experience gravity and other forces as well as collide and bounce off each other. Of course, depending on the behavior of the object, it will be attributed different Components. For example, not all entities need the InputComponent, only the player character.

![Image](/images/object_container/image-05.png)
![Image](/images/object_container/image-06.png)
