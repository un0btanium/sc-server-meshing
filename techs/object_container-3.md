### The Implementation 1/3
Object Containers are wrappers for object types. A container acts as a template from which one or multiple instances (entity) of the same object type can be created. An entity might a player character, coffee cup, a ship or even planets and solar systems. Each object type (and thus Object Container) might have a unique identifier (either a name or a number) with which it can be referred. Each container has a list of the resources it uses, e.g. models, geometry, textures, zones and entity components.

Some Object Containers might represent atomic objects. Others Object Container may represent an entire or partial level. This is done because Object Container can reference of other Object Containers. Thus, Object Containers can be nested. A tree structure of Object Containers is created. For example the Stanton system would be a Object Container which references the Stanton star and its four planetary systems as its child Object Containers. The landing zone Area 18 would be referenced from the ArcCorp planet container, and so on.

![Image](/images/object_container/image-02.png)
