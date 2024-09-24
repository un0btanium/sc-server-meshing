### Entity Authority & Authority Transfers 2/8
In our example, we will have our three players again, just like we did in our previous examples for Client and Server OCS. The difference is that we now have two game servers instead of just one.

We don't show the clients anymore, but remember that loading and networking via Client OCS is still happening. But we rather want to focus on how the game servers simulate and handoff entities between each other (or 'server nodes' as they are also called under Server Meshing).

We can see the split in the level by the green and red boxes. Players Red and Green are busy on the second game server (green box). Meanwhile, player Blue is loading cargo on the first game server (red box). We can see that the servers don't load the entire game world anymore - even if there are players - and instead only focus on their box/section. However, that might not be entirely accurate.

![Image](/images/static_server_meshing/image-09.png)
