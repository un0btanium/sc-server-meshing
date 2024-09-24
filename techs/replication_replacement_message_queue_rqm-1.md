# Replication/Replacement Message Queue (RQM)
### Overview
__Challenges:__

* Once many game servers are in a mesh, the message queues of the Replication Layer and game servers are flooded with too many messages. This was identified in the Tech Preview Playtest in mid 2024.
* If the Replication Layer can't process the messages fast enough, then the queue will fill up more and more, which eventually leads to messages waiting a long time before they are being processed and send to their recipients.
* One of the causes for this is the fact that both game state changes and OCS loading notifications are put into the same queue. This lead to issues when many players join or left the game and lots of areas had to be loaded/unloaded.

__Solution:__ Refactor the Message Queue

__Requirement for:__ Server Meshing

__Goals:__

* Allow higher bandwidth of data by preventing the message queue to fill up and avoid the delay it causes.

__Approach:__

* Refactor the existing Networking Message Queue (NMQ) into the updated Replacement/Replication Message Queue (RMQ).
* Speculated: Split the queues into separate queues. One for game state changes (for real-time processing) and OCS loading notifications (not as much of an issues if a lot of notifications are in the queue).
* This was tested in Alpha 3.24 (with utilizing AB Testing at the beginning of the patch before it was rolled out to all Shards)
* This was tested again in a Server Meshing TechPreview Channel Playtestin September 2024. Other causes for high delay were identified.
