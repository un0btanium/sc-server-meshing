# Server Node Multithreading Scaleup
### Overview
CIG plans to highly multithread their simulation so that a single server node can make use of more CPU cores and support more entities/players. This would reduce the total amount of server nodes required and might minimize the need for server-to-server communication as more entities could be put and simulated on the same server node.

There has been improvements made throughout the years. One major one might have been the improvements to the simulation logic by making the Entity Component Update Scheduler "Entity Centric" and Zone Host Updates and more in Alpha 3.17. Together with netcode improvements, it allowed for servers to utilize more cores, increaseing the number of players per server from 50 to 100+ in Alpha 3.17.2.

