### Summary and Future Features 1/2
While Client OCS allowed clients to have a partial view into the level of the server, Server OCS now allows the server to have a partial view into the entire level. The entire level is now stored in a database on the server drive (and later into the large database at first pCache, then the new horizontally scalable EntityGraph).

The server now does not have to load the entire level anymore, only select parts of it. Thus, even if the level size increases into hundreds of GBs (or even terabytes) in the database, it only needs to load a couple GB of it into memory at all times.

Additionally, Server OCS will also be used for the Squadron 42 singleplayer game to load and unload objects on demand. A local database (EntityGraph) running on our computer along side the game, will act as the game save files by serializing the game objects from memory onto the drive and then loading it again from the drive into memory via Server OCS.

