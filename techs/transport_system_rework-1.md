# Transport System Rework
### Overview
__Challenges:__

* the old systems running elevators, trams and other means of transportation were unreliable and buggy and not useable for Dynamic Server Meshing and Instancing.

__Solution:__ Transport System Rework

__Goals:__

* create a completely new, unifed system for all types of transport with Dynamic Server Meshing and Instancing support in mind

__Approach:__

* The Transport System is a complete rewrite of the Transit System, which governs all communal transport across Star Citizen such as Trams, Trains, Monorails and Elevators in addition to those within vehicles. While the Transit System served its purpose at the time and for a large portion of Star Citizen’s development, it has been unable to efficiently keep up with the latest technological advancements such as Server Meshing, Streaming and Instancing. Transport has been built with all of this and future development in mind.
* This was part of an initiative to move all sorts of services toward "meshing-native solutions" that are compatible with Server Meshing (such as quantum travel interdiction, group jumping, cross-shard quest status sharing, etc.) which were worked on throughout 2025 and 2026. This also included a Marker Service for cross server/cross solar system markers (Entity Cluster Service).