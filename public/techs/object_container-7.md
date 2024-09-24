### Zone System
Additionally, the new Zone System (speculated: a custom hybrid between a space partitioning data structure and a scene graph) splits the game world into areas. All objects inside such an area are grouped together. For example, a zone can be a spaceship. All objects inside that spaceship are grouped, thus being part of that zone. When the spaceship moves, its zone is moved as well, thus moving all objects inside of the spaceship with it. This is made performant by giving each zone its own coordinate system and objects inside are placed and moved relative to the zone center coordinate instead of the game world level center coordinate. And thus, the positions of the objects inside do not need to be updated when the ship moves.

This system replaces the old Octree partitioning system. Octrees split the game world in cubic, immovable chunks. Each cube can be split into 8 smaller sub-cubes. Those sub-cubes can be split into 8 more cubes again. Rinse and repeat. In memory, a tree structure emerges which can be traversed by all sorts of algorithms. The image shows the difference between Octrees and Zones. Be aware that our level example is 2D, thus we are actually showing Quadtrees (the 2D version of the 3D Octrees, using squares instead of cubes thus splitting a square into 4 sub-squares).

With the 64bit conversion, the levels have become extremely large. The Zone System splits the game world much more efficiently, as it is able to concentrate on areas where lots of objects and activity are, instead of splitting empty space into hundreds of empty cubes which creates larger tree data structures which requires more memory and takes longer to traverse.

The Zone System is used for optimizing rendering, physics collisions as well as for networking entity updates and loading/streaming objects in Object Container Streaming. The room atmosphere and physics grid systems are (most likely) directly build upon the zone system as well.

![Image](/images/object_container/image-07.png)
![Image](/images/object_container/image-08.png)
