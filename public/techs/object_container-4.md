### The Implementation 2/3
With Object Containers the level is now split into individual building blocks. Artists and developers do not develop individual levels anymore, but instead individual objects or parts of a level. Those can then be reused anywhere in the level and be part of other Object Containers. Therefore, the final level is made up of nested Object Containers from which game objects (entities) are spawned.

An artist making a change to an object container, changes all entities that originate from that object container in all places in the level. For example, a chair design used all across a landing zone. Instead of having to make changes to all hundred chairs individually, the artists just have to make the change once to the chair Object Container. This makes it easy to make changes, rework and update existing objects without having to update every single object individually. Just the Object Container has to be altered.

![Image](/images/object_container/image-03.png)
