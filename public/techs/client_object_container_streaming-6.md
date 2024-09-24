### The streaming bubble
The bubble doesnt actually exist as such. We are just using it to visualize more easily that stuff is loaded around the player. But in reality, whats loaded are the individual game objects.

(On a similar note, the actual (empty) space of a level doesnt need to be loaded, as 'nothingness' does not have to be represented as a game object in memory).

But we might think of the bubble as the spatial query which determines which game objects to load. This makes use of the 3D 64bit geohash "StarHash" and a Radix Tree which are suited to perform such spatial queries. It factors in the distance between each game object and player, as well as the size of each object.

Therefore far away and/or small objects might not be loaded because those wouldnt be visible to the player anytime soon. Likewise, objects that are really large - like moons or planets -might still be loaded from far away. With Object Containers being nested, not all contents of a location need to be loaded all at once either. While the planet ArcCorp might be loaded already, the Area 18 city or parts of its interior might not be loaded yet as it is still too small. In a similar fashion, these small objects are unloaded first as well when a player departs and moves away from such location.

![Image](/images/client_object_container_streaming/image-04.png)
