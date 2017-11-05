
# Fun with Javascript Obfuscation

If you're into hacking stuff and like to program in Javascript, this post is for you. In this article I'm going to show you how to have fun with those pirate web sites that stream live television. They are full of ads and hacks to prevent you from automatically closing them. Here I'm going to explore some of the hacks they use and how to crack their code just for kicks.

I am going to use as example the web site *cricfree.sc*. These sites come and go and this one probably won't be live at the moment you're reading this. Also, they are certainly not authorized to stream third party television broadcasts and I do not support or recommend that you watch them; Moreover, take further precautions when you visit this kind of site, as they can probably screw your web browser and operating system. Access them at your own risk. Alright, so let's do it.

## Obfuscation techniques

### Booleans

    const someBoolean = !![];

### Function calls

    fnToCall['apply'](fnThis, fnArguments);

### Screwed up way to get a reference to Window instance

    var _0x54de16 = Function('return\x20(function()\x20' + '{}.constructor(\x22return\x20this\x22)(\x20)' + ');');
    var _0x37e3be = _0x54de16();

The first line creates a [function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function). Its first parameter receives a string that will be that function's code body. In the script above, that code is:

    return (function(){}.constructor("return this")());

It creates an [IIFE](https://developer.mozilla.org/en-US/docs/Glossary/IIFE), an anonymous function that will be instantly executed. The anonymous function is created with an empty body, though; it's the `function(){}` part. It does nothing by itself and it's there just to confuse you. The code then accesses the function's `constructor`, which is nothing more than a reference to `Function`. Finally, the code passes the string `return this` as the body of the function, which will be run when the IIFE is executed in the second line of the script. But what is `this`, after all? It is a reference to the `Window` instance of the page, which will be stored in the variable `_0x37e3be`. In the end, all that obfuscated code could just be replaced with `var _0x37e3be = window`. Better yet, you can just go ahead and access `window` directly!

### Disabling console functions

If you want to make it hard for people to investigate your code, one thing you can do is disable all console functions, like this:

    var emptyFunction = function () {};
    window.console.log = emptyFunction;
    window.console.warn = emptyFunction;
    window.console.debug = emptyFunction;
    window.console.info = emptyFunction;
    window.console.error = emptyFunction;
    window.console.exception = emptyFunction;
    window.console.trace = emptyFunction;

### Stopping the page every time someone opens the console drawer

    setInterval(function () { debugger; }, 1000);

The timer above will invoke the `debugger` statement once every second. If the browser console drawer is not open, `debugger` does nothing; once someone opens it, however, the browser halts execution of the page and takes you to the `debugger` statement where it appears in the code.

## How to counter hack

For instance, let's tackle the `debugger` hack. The code on *cricfree.sc* reads as this:

    var _0x283d81 = function() {
        function _0x2929ad(_0x2c43ca) {
            if (('' + _0x2c43ca / _0x2c43ca)['length'] !== 0x1 || _0x2c43ca % 0x14 === 0x0) {
                (function() {}
                ['constructor']('debugger')());
            } else {
                (function() {}
                ['constructor']('debugger')());
            }
            _0x2929ad(++_0x2c43ca);
        }
        try {
            _0x2929ad(0x0);
        } catch (_0x5199fb) {}
    };
    _0x283d81();
    setInterval(function() {
        _0x283d81();
    }, 0xfa0);

Pretty crappy, but all it does is really keep calling `debugger` over and over. Despite the level of obfuscation, it's pretty easy to counter it. All one have to do is override the `_0x283d81` variable with an empty function, like this:

    _0x283d81 = function () {};

Just open the console drawer and run it. It won't work immediately because the original function recursively calls itself, so just pressing *continue* in the browser won't do. You have to close the drawer for our code to work. Re-open it and the `debugger` is gone!

