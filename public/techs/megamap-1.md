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
