
# Hands-on libuv Tutorial

Nov 5th, 2017

In this tutorial we are going to learn how to compile and run a simple application using [libuv](https://github.com/libuv/libuv), Node.js's event loop library.

For this tutorial, I am going to assume we all know what libuv is and what an event loop is supposed to do. Since explaining that demands a tutorial on its own, you can learn about it through other sources. Some good ones to start with:

- [MDN's description of Javascript's concurrency model](https://developer.mozilla.org/en-US/docs/Web/JavaScript/EventLoop): simple explanation of a basic event loop model from the standpoint of a Javascript virtual machine
- [Bert Elder's keynote speech](https://www.youtube.com/watch?v=PNa9OMajw9w): very superficial explanation of libuv's event loop, but useful for those starting and taught by one of the guys responsible for what libuv is today

But enough with the bullshit; let's get down to business!

## Prerequisites

First, a disclaimer: I'm assuming you are either using Linux or MacOS and I'm not going to provide details for building stuff on Windows, sorry. You shouldn't be using Windows for any serious development (unless, of course, you *need* to build your application for it).

Things you are going to need:

- gcc: please make sure your gcc is not too old. I'm using C++14 in this tutorial, so check first if your gcc version support it
- CMake: I am using [CLion](https://www.jetbrains.com/clion/), which uses CMake to build the project. Although Clion not being mandatory, it's going to be easier if you use at least CMake, so you can make use of my CMake script

## Downloading and compiling libuv

libuv is an open source project currently hosted at Github. You can just clone it by doing:

    git clone git@github.com:libuv/libuv.git

Instructions can be found in its README.md, but let's just cut to the chase here:

    sh autogen.sh
    ./configure
    make
    make check

Notice I didn't `make install` it. I'm currently just pointing my project to link to the object found inside my `libuv` folder, which is sibling to my project's.

---
continue here

My project can be found at https://github.com/luciopaiva/libuv-sandbox
