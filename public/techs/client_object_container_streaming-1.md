# Client Object Container Streaming

![Image](/images/milestones/milestone-02.png)

### Overview
With Object Containers it is now possible to split a level into separate game areas and load them into a level anytime. However, that functionality cant be utilized yet. Client Object Container Streaming (sometimes Client Side OCS or CSOCS or COCS) sets out to change that.

__Challenges:__

* by increasing the amount of objects in the level, more and more system memory is required
* by adding more entities into the level, the load on the CPU for entity computation each game tick increases
* the CPU of the client has to keep entities in sync with the server by updating its state
* too many entities computed currently results in not enough CPU load available to help render the game
* frame rate and performance on the client drops

__Solution:__ Client Object Container Streaming, an intermediate step toward complete Object Container Streaming, also sometimes more generally known as (Area of) Interest Management

__Goals:__

* reduce the memory requirements on the player client
* reduce the load on the CPU on the player client
* allow for more objects and entities to be added into the level on the server (e.g. more planets, locations and players)

__Approach:__

* reduce memory usage by only loading the nearby/visible objects of the level around the player
* dynamically stream Object Containers in and out of the level while the player is traveling across the level or entities (like other players and their ships) approaching/leaving the player
* the server notifies the player clients whenever the player clients should load objects
* streaming entities in and out reduces the amount of entities that have to be computed by the client CPU
* for far away entities, the server stops/skips network updates based on the entity's distance to the player to save client CPU usage (such features are generally called Interest Management, limiting the necessary information sent/simulated by that what interests the client)
