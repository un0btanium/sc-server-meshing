### Serialized Variables (API)
Optimization was done on the networking to reduce bandwidth. On each game tick the server has to send the state of entities to the player clients. With the high amount of data of entities in Star Citizen, this will result in a lot of data and thus bandwidth. Therefore, CIG implemented an system which detects any entity state changes. It then only sends those changed values across the network instead of the entire state of the entity, which would include unchanged values as well. This network optimization made it possible to reduce the bandwidth up to 80% for certain Entity Components.

![Image](/images/object_container/image-09.png)
