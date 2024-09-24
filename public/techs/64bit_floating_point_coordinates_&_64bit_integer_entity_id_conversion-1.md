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
