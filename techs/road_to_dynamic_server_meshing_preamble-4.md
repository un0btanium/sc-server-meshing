### Game Objects, Game State, Limitations
In video games, we can use these instructions to simulate a game world. This game world is directly made up of game objects. Updating each game object requires a certain amount of instructions to perform its simulation logic. For example, their change in position and orientation in the game world, as well as other state attributes of the object (e.g. a door might be in an open, close, opening or closing state).

But remember that there can only be one instruction executed in each clock cycle? And we "only" have e.g. 4.0GHz = 4.000.000.000 clock cycles (and thus instructions) per second available? This means we are limited in the amount of instructions per second. And this consequently means we are also limited in the number of game objects we can update and simulate. Although, the number of instructions a game object requires may vary, as it depends on the complexity of the game object.

So when adding more and more game objects, eventually, we won't have enough instructions available to update all of them in a timely manner. We are not allowed to skip the update of game objects as that would seemingly "freeze" parts of the game world. Instead, the next round of updates for ALL game objects is delayed. This is usually referred to as 'low tickrate' and will talk more about tickrate and the game loop later.

