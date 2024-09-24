### Vertical & Horizontal Scaling, Large Game World
Of course to support more game objects, we could simply throw faster hardware at the problem. Use a CPU with 5.0GHz instead. Done! However, this only works up to a certain point. There are hard limits to hardware and better hardware becomes exponentially more expensive as well. Using better hardware is called vertical scaling.

Another and more promising option is horizontal scaling. Here, we simply use another CPU, an additional computer. By using multiple computers, each one with a CPU, connecting them via a network and having them exchange relevant data, they can work on a much larger workload.

If done right, as in having solved memory management, loading of data (memory is still limited resource on each machine, so as the game world grows not every game object needs to be loaded into memory), game simulation (a game object doesnt have to be simulated on all machines, but just one), networking (data is only send to computers that need it) and persistence (read and write data in databases for later use), then you have huge amounts of processing power at your finger tips. You could execute trillions of instructions across hundreds of computers/servers each second and simulate a large, game object-rich game world.

__Note:__ As is often the case, it is more complicated than this, but this is a good first introduction of what Dynamic Server Meshing is about.

