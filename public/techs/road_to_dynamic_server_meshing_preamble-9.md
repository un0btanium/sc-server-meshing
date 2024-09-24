### Doing math and performing logic
So what do all of these components do? It comes down to executing code: commands which instruct the computer to perform math and logic on the data in memory. These code instructions alter the data, turning that data from one state into another state. And depending on the processor architecture, cores and clock speed (e.g. 4.8GHz) there can be multiple billion instructions executed per second. Those results are then send over a network and/or used to create an image on our monitor screens.

In the example on the right, we have four instructions that load two values from memory (from the two memory addresses 128 and 256) then perform addition on them and the result is stored back into memory at memory address 128 (essentially overwriting the previous value that was stored there). In the context of a videogame, these could be the position x and the velocity vx of our player character. So the computer calculated our character's next position in the level. More on this "Game Update Loop" chapter in this Introduction.

1) load r1, 128

2) load r2, 256

3) add r3, r1, r2

4) store r1, 128

