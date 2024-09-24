# 64bit to 32bit converter
### Overview
We now use 64bit floating point value coordinates to allow for large level sizes.

__Challenges:__

* however, GPUs are much more efficient when being able to use 32bit floating point values for their calculations when rendering images

__Solution:__ 64bit to 32bit converter

__Requirement for:__ Object Containers

__Goals:__

* have a 64bit world size to simulate the objects within and at the same time allow the GPU to use 32bit coordinates to render the game

__Approach:__

* therefore, a 64bit to 32bit floating point zone-to-world converter and a world-to-camera relative space converter were implemented that turns those 64bit world coordinates into 32bit coordinates for the renderer where the player camera is being placed at (0,0,0)
* other objects are then positioned relative to the player camera
* this assures that the precision directly around the player is very high; objects further away (like planets or moons) might be slightly mispositioned but that is barely noticeable at such distances

![Image](/images/64bit_to_32bit_converter/image-01.png)
