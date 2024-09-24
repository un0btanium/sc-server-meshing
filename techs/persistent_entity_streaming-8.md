### EntityGraph 3/4 - "Entity-Graph service"
Last but not least, besides the two shiny new databases, we also have a new scalable service specifically for facilitating persistence. These new services sit in front of the two databases and allow query requests to be sent from other services/servers that need to access their data. Because some write requests expect changes to be made to both databases as part of one transaction (see Stow & Unstow feature on the next slide), the services handles and relays the appropriate database queries to the databases.

The "services provide translation from our game specific 'query language' into the query operations of the underlying database and translate the results back into a form the game can easily understand. [They] also provide extra reliability and scalability guarantees [...]. What [they dont] do is any form of caching, however it talks to a NoSQL database that performs its own distributed in-memory caching. Not only that but the database is specifically and optimized for graph data which is a much better fit for the type of queries we need to do."

__Note:__ In a followup patch to Alpha 3.18, CIG did introduce caching for Global Database queries in the Entity Graph services: "The team also added inventory query caching to the entity-graph service. This stores the results of inventory queries in a cache to take the load off the database for repeated lookups of the same query, allowing for faster response times and less load on the database. This increases the overall read and write performance of the entity-graph service."

__Note:__ It seems "EntityGraph" can refer to the whole persistence backend solution, just the persistence services, the graph database or even the Global Database/Global Persistence. Confusing, I know.

![Image](/images/persistent_entity_streaming/image-09.png)
