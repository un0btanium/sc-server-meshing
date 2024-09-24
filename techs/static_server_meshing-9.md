### Entity Authority & Authority Transfers 1/8
(Static) Server Meshing splits the level into multiple sections to simulate each one on its own server. For example, the Stanton solar system could be split in half. Then two game servers could compute two planets each.

In our example on the right, this split has been the green and red boxes. We only split the level into two sections, however Static Server Meshing could allow for dozens of sections (e.g. each of the major planets and each of their moons in the Stanton system on their their own server). However, this might be an inefficient use of servers since it could lead to a lot of empty or low load servers. Therefore, it initially will be divided in as few sections as possible for testing purposes, then slowly increased in numbers over subsequent patches, with Dynamic Server Meshing the next goal.

In our example, we split the game world into two sections, red and green.

We are going to explore the concepts of Server Meshing by following the journey of the blue players which is about to travel from Microtech to Hurston.

![Image](/images/static_server_meshing/image-07.png)
![Image](/images/static_server_meshing/image-08.png)
