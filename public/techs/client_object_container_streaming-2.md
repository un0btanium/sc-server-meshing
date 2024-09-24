### Initial Situation
Without Client Object Container Streaming, all clients and the server have the entire level loaded. This means that all object have to be loaded from drive into memory on level start or when connecting to the server. The server CPU computes all objects/entities and sends state updates to the clients via messages over the network/internet. This leads to CPU usage on the player client being quite high because it receives information about all objects in the level as well as the CPU having to help prepare the next frame to be rendered as well.

The client is overloaded with too much information and the CPU cant help render the game as much anymore and even the frame rate starts to suffer. The server does not have that additional load since no graphics are being rendered on it, only the entities updated on each game tick.

In the picture on the left, at the top, we can see that the entire level is loaded (white area is loaded). CPU (blue) and memory usage (orange) are quite high since all entities are loaded from drive into memory and being computed on the CPU.

![Image](/images/client_object_container_streaming/image-01.png)
