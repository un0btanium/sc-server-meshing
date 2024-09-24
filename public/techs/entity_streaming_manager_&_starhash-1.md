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
