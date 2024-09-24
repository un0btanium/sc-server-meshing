### CPU Instructions
In each clock cycle, we can tell the CPU what to compute. Rather than having to tell the CPU where electrons need to flow, the CPU provides us with a defined set of instructions, a CPU instruction set, which abstracts all of that low-level hardware stuff away for us. In each clock cycle, we can have the CPU execute one such instruction.

Different instructions are responsible for different things: some instructions do math, others compare, move data around in memory or even alter the execution of our program.

CPU instructions are the interface between the hardware (our logic gates) and the software. Executing multiple CPU instructions in sequence (or even in parallel) allows us to perform more complex calculations and logic. Programs emerge.

__Note:__ These days, modern CPUs are further optimized and can sometimes perform multiple instructions in one clock cycle.

__Note:__ All software programs written in a programming language are translated into these CPU instructions at some point. The CPU does not know about any programming languages, except its instruction set. But since instructions are very very atomic operations, programming languages abstract these away to help us create complex programs easier and faster.

