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
