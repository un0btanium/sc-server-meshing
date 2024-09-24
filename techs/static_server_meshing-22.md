### Humble Beginnings - The Hybrid Service 3/3
However, the plan is to eventually move all these components out of the Hybrid to have them be their own services, running on their own servers. Once all components have been taken out, the obsolete Hybrid service will then be removed. This work is done when working on/toward Dynamic Server Meshing, after Static Server Meshing has released.

The individual service types are going to be horizontally scalable, meaning that multiple Replicant services could be running alongside each other. This is how Server Meshing is planned to be scaled up to support many more entities and players.

But - because the Shards for the very first versions of Server Meshing are still going to be very small (few server nodes and player clients) - a need for many services is not there yet. To bring Server Meshing online, have its functionality tested and made robust, a smaller, more manageable environment with a single Hybrid service is much more suitable. The infrastructure complexity and its overhead is minimal and the focus can be on maturing the functionality itself. Once that is working fine, the components will be turned into services and scaled up.

![Image](/images/static_server_meshing/image-25.png)
