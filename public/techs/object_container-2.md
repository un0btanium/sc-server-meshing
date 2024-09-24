### Example
In the visual example on the left, we have loaded three players into the level. The red and green players are near each other on the same planet while the blue player is on a different planet far away. However, to avoid visual clutter, the planets, ships and other objects were left out of the image and we only show the connected players. We are going to revisit this example in the upcoming major technologies again.

Underneath, we also see a visual representation of the load on the individual computer components. The load on the CPU (blue) and GPU (red), how much RAM (orange) is in use, which part of the drive we loaded into memory (grey area). In this case the data of all objects were loaded from drive into memory, the load of CPU and GPU and memory occupied is quite high. (In the context of Server Meshing, the GPU is not as relevant as the CPU and memory.)

With the level split into different building blocks (Object Containers), the game could load and unload parts of the level at anytime. Therefore, we would only ever need to load the parts of the level into memory which are near and visible to the player (like a few kilometer sphere around the player) instead of having to load the entire level from drive into memory. This allows the game to keep memory consumption low enough to not exceed the maximum memory capacity.

However, the functionality to stream objects from the drive into memory after the initial level load wasn't actually introduced yet with the release of the Object Containers. The player client and game server still had to load all objects of the level at its initial load because there was no logic yet that would tell client and server which objects it should load or unload. The functionality for streaming objects in and out of a level at any time became only possible with the introduction of Object Container Streaming which we will talk more about later.

![Image](/images/object_container/image-01.png)
