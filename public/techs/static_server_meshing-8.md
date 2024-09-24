### Major and Minor versions of Server Meshing
In the very first version of Server Meshing, each Game World (Universe/Shard) will mostly likely only be computed by a few game servers. Mainly to be able to test the functionality in a simple and controlled environment.

Afterwards, it will be increased to more and more game servers across multiple patches. While there are going to be many of these gradual increases, there are going to be two major versions which Server Meshing can be categorized into:

Static Server Meshing

* A game world is going to be split manually into sections by the developers. Each section will be simulated by one game server.
* The name "static" means that these sections stay unchanged in their virtual size and amount (and thus also the amount of game servers).
* Game servers (indirectly) exchange information whenever necessary, e.g. to allow for seamless transitions and interactions of entities, as well as game servers exchanging entity state with each other where necessary (e.g. for collision checks).
* There will still exist many Game Worlds/Shards along side each other, since not enough computing power will be available yet to fit all players into a single Game World/Shard.
* A performance issue with this implementation exists: when all players of a Shard meet up in one section, then all have to be computed by one game server. Then that game server will be overloaded again, dropping in tick rate and negatively impacting the player experience.

Dynamic Server Meshing

* The size and amount of these sections wont be fixed anymore. Instead each game server is now able to follow its players wherever they go.
* The name "dynamic" also means that the amount of server nodes can increase and decrease, besides the entities a game server is simulating changed on-demand anytime. The game world can be split up differently while we are playing the game.
* All of this is done programmatically, meaning that - for each Shard - an algorithm is monitoring the performance on all of its game servers and then tries to optimally distribute the load across those game servers. More game servers can be spun up or existing, underutilized ones shutdown.
* There will also be multiple minor versions of Dynamic Server Meshing, each increasing the number of game servers per Shard, until eventually all players of a geographical region (EU; US, etc.) fit into one single regional Shard, maybe even all players world-wide into a single word-wide Shard.
