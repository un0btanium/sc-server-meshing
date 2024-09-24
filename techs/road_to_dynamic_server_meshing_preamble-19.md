### Game Update Loop - Networking Entity State 3/3
Each client receives the data packet, opens it and saves it into its memory. Now the client would be up to date with the server again and reflect the current state of the game world (e.g. by rendering a frame on the screen).

Although in the image, the coordinate values were saved at the same memory address on the client, in a real application they usually are in different locations in memory. Each computer manages their own memory and determines for itself to which memory addresses the values have to be saved. This just covers the basic networking logic. There are further optimizations (such as client-side prediction and server reconciliation) which is generally know as netcode. However, we wont go into too much detail on such optimizations over the course of this presentation. This current knowledge on networking game state will suffice for now.

![Image](/images/road_to_dynamic_server_meshing_preamble/image-11.png)
