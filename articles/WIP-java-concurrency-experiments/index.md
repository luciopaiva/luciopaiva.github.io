
# Java Concurrency Experiments

Dec 2nd, 2017

Some notes on practical experiments I did.

## Why volatile?

Although there are several tutorials on the subject, most people won't understand it completely until proof is given of why one would need volatile variables. Here's one proof:

    package com.luciopaiva;

    public class VolatileTest {

        private static boolean isActive = true;

        private static void sleep(int millis) {
            try { Thread.sleep(millis); } catch (InterruptedException ignored) { }
        }

        private static void otherThreadMain() {
            sleep(1000);

            isActive = false;

            System.out.println("Aux thread has finished");
        }

        public static void main(String ...args) {
            Thread auxThread = new Thread(VolatileTest::otherThreadMain);
            auxThread.start();

            while (isActive) {
            }

            System.out.println("Main thread has finished");
        }
    }

The example is simple: the main thread spawns a new thread that will wait 2 seconds and then change a boolean to false, signaling to the main thread that it should finish. If you run this example as is, you will discover that it never finishes. After 2 seconds the auxiliary thread will report it's finishing, but the main thread will never know about it. It will just keep running forever. That's because it has no reason to synchronize its local memory with the global memory.

But, as soon as you turn `isActive` to a volatile, it's change is immediately seen by the main thread. And that's a quick way to understand why volatiles are needed.

One may suggest that the main thread is busy waiting (i.e., never relinquishing the CPU) and that it is bad practice. Why couldn't we just put the main thread to sleep using a lock that could be signaled by the auxiliary thread 2 seconds later, making the main thread wake up and do what it has to do? Well, sometimes the main thread can't be put to sleep. For instance, if you're developing a low latency network application that needs to constantly process incoming data, you can't afford to go to sleep. I'm talking about thousands (or more) of incoming messages per second. As Trisha well put it (include reference to her blog), threads locking for resources are like children fighting over some toy and asking for their dad (i.e., the operating system) who has the right to play with it. Dad has more important things to do, so he may just take the toy and decide to postpone his decision until he finishes other more serious tasks. Wise children would be better off coming to an agreement themselves and avoid having to include dad in the dispute. Analogously, wise threads shouldn't lock!

### It synchronizes all memory

The funny thing about it is that it is able to synchronize not only itself, but other variables as well. The whole memory is flushed upon access to a volatile variable. I am not going to explain in detail why this happens, but here's [a very good tutorial](http://tutorials.jenkov.com/java-concurrency/volatile.html) detailing it. Basically, Java guarantees what is called a "happens-before" relationship, making sure that any changes to variables in the local thread context that took place before the volatile variable was written to are flushed to the main memory. Likewise, reading from a volatile variable also guarantees that the local memory is first updated with any changes coming from the main memory.

To prove that this happens, here's an example:

    public class VolatileTest {

        private static boolean isActive = true;
        private static int flag = 1;

        private static void sleep(int millis) {
            try { Thread.sleep(millis); } catch (InterruptedException ignored) { }
        }

        private static void otherThreadMain() {
            sleep(1000);

            flag = 2;
            isActive = false;

            System.out.println("Aux thread has finished");
        }

        public static void main(String ...args) {
            Thread auxThread = new Thread(VolatileTest::otherThreadMain);
            auxThread.start();

            while (isActive || flag == 1) {
            }

            System.out.println("Main thread has finished");
        }
    }

In the example, `flag` is an int variable *not* marked as volatile. Still, whenever `isActive` is accessed, `flag`s local value is magically updated. For the main thread to end, its view from both variables must be up-to-date. So we just need a single volatile if we want to get consistent with the main memory. If stop reading from `isActive`, the main thread will loop forever:

    while (flag == 1) {
        // will never end
    }

And it's interesting to see that if we had simply swapped the order conditions are checked, the loop would run forever as well:

    while (flag == 1 || isActive) {
        // will never end as well
    }

That's because since `flag == 1` was enough for the loop to continue, the second condition didn't even need to be checked.

Yet more interesting, though, is the fact that you don't even need to change the value of `isActive` for the change in `flag` to be seen. The main thread only needs to read from `isActive` to make all memory to be flushed:

    public class VolatileTest {

        private static volatile boolean isActive = true;
        private static int flag = 1;

        private static void sleep(int millis) {
            try { Thread.sleep(millis); } catch (InterruptedException ignored) { }
        }

        private static void otherThreadMain() {
            sleep(1000);
            flag = 2;
        }

        public static void main(String ...args) {
            Thread auxThread = new Thread(VolatileTest::otherThreadMain);
            auxThread.start();

            while (isActive && flag == 1) {
            }

            System.out.println("Main thread has finished");
        }
    }

The stop condition now requires that `isActive` is true **and** `flag` is 1. Just by reading from `isActive` the main thread makes the `flag` value to be updated, making the loop to break.

### It's cheaper than locking

Compare with producer/consumer example using locks.

### Forcing synchronization without volatile

Simply calling `System.out.println()` forces memory synchronization, since internally `println()` is using locks.
