### Networking - The Client-Server Architecture
Since Star Citizen is a multiplayer online game with many players playing in the same game world, the data has to be shared and communicated between the players over the internet. Star Citizen uses the common client-server architecture to accomplish this.

In such an architecture, you usually have a computer that acts as the server and other computers which act as the clients. All computers are connected over a network (e.g. the internet). The clients can connect themselves to the server and then the server and the clients can exchange information over the network between each other. Clients don't establish connections between each other, and instead all clients are connected to the server. The server distributes/relays the information from one client to the other clients.

In the case of Star Citizen, each player starts their game and their game client will establish a connection to a game server. The game server runs just another instance of the game, just like the player game clients. However, the server instance is special because it does not actually act as a player. The server simulates the game world while listening to the incoming actions from the player clients, then sends the resulting changes back to all clients which will then in turn update their own game world accordingly.

Since communication between multiple computers over a network always introduces latency between the sending and receiving of data packages, the state of the game world will always be slightly different on each player client and the server. To ensure that the game provides a reliable gameplay experience for all players, the server instance is deemed to be the "ground truth" about the state of the game world. Basically the server has the authority of the game state. That means that the player clients will always trust the data that comes from the server over its own current world state. Since the server always simulates the game world and thus

validates the player actions, this guarantees that all clients will stay synchronized with the server and that

the game world a player sees wont deviate drastically from what other players see on their screens.

![Image](/images/road_to_dynamic_server_meshing_preamble/image-04.png)
