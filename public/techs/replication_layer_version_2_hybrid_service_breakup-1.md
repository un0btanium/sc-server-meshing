# Replication Layer Version 2 (Hybrid service breakup)
### Overview
The components of the Hybrid services are going to be move out and into their own services. These services are going to be horizontally scaled, allowing multiple of these services to run alongside each other, allowing for more processing power and bandwidth. These services can then be spun up and shutdown dynamically based on demand. This is how Shards are going to be scaled up, allowing for more game servers and players per Shard to potentially reach one single shard per region.

For PES, there is the (Service) Fleet Manager service already in the works which is being designed with scaling game servers and services in mind.

