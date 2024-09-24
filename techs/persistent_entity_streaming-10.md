### The Replication Layer 1/2 - Rollout
But PES does not just consist of databases. While, Persistent Entity Streaming feature came online in Alpha 3.18, the groundwork had been layed since at least Alpha 3.13/3.14, where code has been moved around in the game server code to prepare for the Replication Layer. We will talk more about this Replication Layer in a lot more detail in the upcoming Server Meshing topic. For now, all we need to know is, that a lot of the OCS and PES code has been moved into this Replication Layer, with the purpose of being able to move it out and onto its own server later.

After the prep-work in Alpha 3.13 and 3.14, in Alpha 3.15 the Global Database came online and the Replication Layer was setup to make queries against it. Inventories came first online with this update.

In Alpha 3.17, the Replication Layer now copies parts of the game world into its own memory/cache which is then used to run the OCS loading and networking logic.

And then, in Alpha 3.18, the EntityGraph database came online and with it, PES and the persistence of most ingame items/entities. The Replication Layer was setup to both read and write to the EntityGraph database and the Global Database.

![Image](/images/persistent_entity_streaming/image-11.png)
