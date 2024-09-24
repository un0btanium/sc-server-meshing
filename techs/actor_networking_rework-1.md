# Actor Networking Rework
In the game code, an Actor is an humanoid or animalistic entity in the game which can be controlled by either a Player or by the AI and therefore 'acts' in the game world. Currently, actor movement is client-authoritative, meaning that if a player presses his 'W' button, the player client executes the appropriate action (in this case the player walks forward) and sends the new player position to the server which then sends it to all the other connected player clients to have the action replicated.

__Challenges:__

* can cause perceived lag and other players teleporting around especially when they have a poor connection to the server
* because the server does not validate the player actions, detecting certain types of cheating becomes more difficult to deal with since the client can just make up any player positions and the server will always consider that data to be correct
* for smooth actor movement and animations there is a 250ms delay injected as a workaround to compensate for lag spikes

__Solution:__ Rework of the Actor Networking ('netcode' for actor movement), split into two parts:

* Upstream: Client-to-Server, released in Alpha 3.6, barely any noticeable effects for players yet
* Downstream: Server-to-Client, functionality will become noticeable for players, slowly and continuously rolled out across a lot of the Alpha 3.x patches, major update and improvements for this in Alpha 3.17.2

__Goals:__

* make actor movement server-authoritative with client-side prediction (to clarify, this only affecting Actors that does not include ship and weapon networking, those will be separate features/deliverables, partially reusing some of the code)

__Approach:__

* the player client still executes the movement on its end but also sends a notification containing the pressed button (as an 'action') to the server. The server then executes the action on its side as well then compares its result with the result of the client. If they line up, then everything is okay. If they deviate, then the player client is notified and the position of the player is adjusted to what the server considers correct. This allows the server to validate all player actions.
* other players with bad connections wont teleport around anymore, but if you are the one lagging then you will be the one being teleported around (aka rubber-banding)
* the actor delay will be reduced to something reasonable (~66ms), with improve dead reckoning and state processing
* update: that delay has now been made dynamic, meaning that it will be lowered on low latency connections automatically
* Alpha 3.17.2 "Enabled new remote movement and new server authoritative position systems. With this update, players should see great improvements with on foot player positions and less jittery behavior while viewing remote player movements."
