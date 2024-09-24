### Replicant & Gateway - The Deeper Look
The Replicant & Gateway are components of the Hybrid service. However, not all of their code is new. Parts of their functionality already existed as OCS and PES functionality.

OCS had already introduced various logic to load Object Containers on both clients and servers, as well as optimized the networking by only sending entity states to the individual player clients that need it.

And PES moved and grouped that logic as part of the Replication Layer.

For Server Meshing, that logic is now moved into the Hybrid service as part of the Replicant and Gateway components. And for later versions later moved out again, onto their own servers, to make those horizontally scalable and shards larger.

