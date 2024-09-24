### EntityGraph 2/4 - Another database: The Global Database
Alongside the graph databases, there exist another database: The Global Database. But why another database? Why the need for two databases?

The reason for this is that each game world has its own state. And this state is saved into its own EntityGraph database (collection) where all physicalized entities of that specific game world are saved into.

In comparison, the Global Database allows specific data to be made available to all game worlds. Therefore there exists only one Global Database for all game worlds, in contrast to one EntityGraph database for each game world. This is required for player ships, all items on the player character or inventories in general, which should be available in the same state, independent on which server the player is currently playing on.

The Global Database stores data related to Reputation, Currency (aUEC) and - most interesting here - Stowed Items. Items are interesting because they can be persisted in either the EntityGraph or the Global Database, depending if they are stowed or unstowed. We have a deeper look about items on the next slide.

