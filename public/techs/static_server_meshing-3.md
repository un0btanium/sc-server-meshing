### A simpler visual abstraction for game servers and clients
Since we are now entering the topic of Server Meshing, we need to represent the network connections of servers and clients in a more simplified fashion.

The left half of the picture shows the server at the top and the connected players with their game clients at the bottom. Together they are forming a single Game World. There exist dozens of these Game Worlds independently from each at the same time. As before, the clients and servers are connected via a network (which in this case would be the internet) to allow information to be exchanged as data packets to have the server and clients stay synchronized.

The right half the picture shows our new simplified version. We now represent the game servers as rectangles and player clients as circles. Since each server and client is unique, we will sometimes identify them with numbers (and colors in the case of the player clients).

![Image](/images/static_server_meshing/image-02.png)
