### The Replication Layer 2/2 - Migration onto its own server
After PES released in Alpha 3.18, the next step in the plan was to move the Replication Layer out of the game server and onto its own, separate server.

This is necessary for Server Meshing, as the Replication Layer will be responsible for the communication between the clients and multiple game servers. However, initially, there will only be a single game server connected to the Replication Layer. Only after it is tested and working, will the number of connected game servers be increased, at which point Server Meshing starts to comes online.

Once the Replication Layer is moved out of the game server, it is sometimes also referred to as the Hybrid Service. The Hybrid Service likely contain some additional functionality required to Server Meshing (e.g. it's Atlas component, more on that later).

This shows that Persistent Entity Streaming and Server Meshing are two tightly coupled features and were developed alongside each other. We will go into more detail about the Replication Layer/Hybrid service and the Server Meshing architecture as a whole in the next major topics.

![Image](/images/persistent_entity_streaming/image-12.png)
