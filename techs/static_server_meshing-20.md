### Humble Beginnings - The Hybrid Service 1/3
The Hybrid is a service and the initial heart of Server Meshing.

The Hybrid service sits between the game servers, player clients and the EntityGraph database of a Shard. It can be seen as the glue that connects everything together by coordinating and communicating between clients (represented as circles with a C), game servers (server nodes) and database.

Initially, each Shard will have one such Hybrid service. The server nodes and player clients establish a network connection to the Hybrid to be able to send and receive data from it. The Hybrid will establish a connection to a EntityGraph database to request and store the state of the Game World.

Using a mediator service like this - which sits between everything - makes it easier for the logic on the clients and servers as they don't have to be aware of where their data goes to or comes from. It all goes to the Hybrid first, which takes care to further relay it to the actual destination(s). Furthermore, each server node and client only needs to establish a single connection to the Hybrid, rather than every participant having a connections to all other participants of a shard. The Hybrid reducing the number of direct interactions and required decision making that would otherwise have been done on each game server.

When the Hybrid first comes online, it will only feature a single server node to test it. Once this new infrastructure is working, more server nodes are added and Server Meshing comes online.

![Image](/images/static_server_meshing/image-23.png)
