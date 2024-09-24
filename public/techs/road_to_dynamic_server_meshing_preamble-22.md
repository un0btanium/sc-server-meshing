### Objects and Entities (and Components)
One last topic before we can finally start our journey toward Dynamic Server Meshing is the difference between objects, entities and components in the game.

The game world is usually created out of static objects (brushes). These objects are usually floors, walls, ceilings, stairs, planet surface, etc. These static objects are pure geometry and do not have any special behavior attached to them (except maybe a separate hitbox for collision checks) and therefore do not have to be updated in the update loop at all. Thus, they are very cheap objects CPU computation-wise and merely need to be rendered on the GPU.

However, games usually feature dynamic objects as well, like players, NPCs, ships, other vehicles, doors, etc. Essentially everything that moves, interacts or has behaviors are considered dynamic objects. They are usually referred to as entities (entity in singular) and are the ones which are updated in the game loop on the CPU.

Based on the number of game tick per second the game runs on, the CPU only has a few milliseconds to go through all entities that require an update and update them. Star Citizen has a tick rate of 30 and therefore 33 milliseconds (ms) computation time available for each game tick. Usually a modern computer can handle a few thousand entities depending on the complexity of those entities. When there are too many entities or too many complex entities being updated, then the game starts to slow down which can have a noticeable impact on the player experience. Therefore, the goal is to keep the entity computation low enough for a smooth experience by staying under those 33ms for each game tick.

As we will see later, Star Citizen reworked its entity system to an Entity Component architecture and splits each individual behavior in the game into its own component which then can be attributed to any entity. Therefore, it matters how many components are being updated in the game update loop, not necessarily the amount of entities.

