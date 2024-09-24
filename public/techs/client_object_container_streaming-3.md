### The Solution 1/2
With Client Object Container Streaming, clients do not have to load the entire level anymore, only the nearby objects around them. This may be another player standing right in front of the player, the enemy space ship the player is shooting at, the space station in orbit, or the moon far away in the sky. Which objects are being loaded is determined by how far away and how large the object is, so that the moon in the sky will be computed and displayed but not the small players which are on that far away moon.

In the picture on the left, we now see that for each player client only the area around that player is loaded. The remaining level is not loaded which is represented with the greyed out areas. We also see the expected reduction in memory usage (orange) and the load on the CPU (blue) since we have to load less data into memory and need to update less entities on each game tick.

__(Note:__ All percentages are purely for visualization, not real world performance statistics!)

![Image](/images/client_object_container_streaming/image-02.png)
