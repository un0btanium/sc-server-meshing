### Entity Zones - Game World splitting via the ZoneSystem 1/2
To understand how Entity Authority and Authority Transfers will work, we also need to talk about Entity Zones. In order to have different server nodes of a Shard compute different sections of the game world, there needs to be logic that splits that Game World into such sections. These in-game sections are referred to as Entity Zones (speculated: sometimes called Territories).

Splitting the Game World will make heavy use of the existing ZoneSystem (physics grids). It already splits the Game World into sections (see ZoneSystem topic).

A Zone can be a room, spaceship interior, landing zone or even a planet/moon, planetary system or an entire solar system. Multiple Zones form a tree structure.

Without Server Meshing, the entire Game World can be thought of to be just one single large Territory. All these Zones and all entities within would be computed by exactly one DGS. The entire Game World is therefore computed by a single game server. This is shown in the images on the right, where all zones are marked with a red color. But, on the next side, once we can have multiple DGS (server nodes) working together, there will be many Territories in a single Game World.

![Image](/images/static_server_meshing/image-17.png)
![Image](/images/static_server_meshing/image-18.png)
![Image](/images/static_server_meshing/image-19.png)
