# Gateway Layer & Gateway Services
### Overview
Gateway is one of the components of the initial Replication Layer/Hybrid Service but will be its own scalable service later on.

__Challenges:__

* communication between clients and server nodes (and Replicants) has to be scaled up to support more of both in the same shard

__Solution:__ Gateway component, Gateway Layer with horizontally scalable Gateway Services

__Requirement for:__ Persistent Entity Streaming, Server Meshing

__Goals:__

* distribute network updates between multiple clients and Replicants

__Approach:__

* While the Replicant service is responsible for distributing data between multiple server nodes ("server node facing"), the Gateway service is responsible for distributing data between the clients and the Replicant services ("player client facing").
* Clients dont connect themselves directly to server nodes anymore nor to the Replicants, but to Gateway services instead.
* The network state updates send from the player clients will be relayed to the correct Relicants by the Gateway services.
* Likewise, the server nodes send their network updates to the Replicant which will then relay it to the relevant Gateway service(s) that need this data. The Gateway service will then relay/replicate this data to the clients that need that specific data.
* Clients might be communicating with multiple Replicants at the same time by having the Gateway establish connections to multiple Gateways at once, exchanging network updates between all of them.
* Highly speculated: When the Gateway service receives network updates from a client, it directly sends it to the clients that require it. It also sends those network updates to the Replicant services that require it, which will relay it further to their server nodes that require it.
* This might allow for low-latency communication between clients, as well as allowing the server nodes to verify player actions and sending validation/rollback updates back to the clients shortly after. Actions already performed on the clients will be rolled back if the server node concludes a different outcome for the player action.
* The Gateway (just like the Replicant) operate event-driven, meaning that they directly process network updates when they are received.
* The Gateway component may have come online in Alpha 3.17 as part of the Replication Layer already.
* The Gateway service will be released once the Hybrid service is broken up (see Replication Layer V2).
