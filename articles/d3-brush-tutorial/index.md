
# D3 Brush Tutorial

Aug 17th, 2017

This tutorial explains what's the purpose of and how to use D3 brushes. A brush adds a movable/resizable rectangle to a
SVG element. It's very useful, among other uses, for when you want to visually select a portion of data in your data
set.

## The brush object

D3 defines some brush "behaviors" (that's how [the docs][3] call it). We can have one-dimensional or two-dimensional
brushes.

To start, let's create a brushX object. It is one of the one-dimensional brushes (the only other one is obviously the
brushY object, as you may have guessed). Its movement is constrained to the X axis and it's probably the most commonly
used brush out there:

    const brush = d3.brushX()
        .extent([[0, 0], [width, height]])
        .on('start brush end', brushed);

Like all other objects in D3, you can create a brush and chain method calls to it right away. The first one above is
`extent()`, which defines the extent for the size in pixels of the rectangle that will be created. You will normally set
its maximum values to the very size of the container element, so the rectangle can be stretched to cover the whole area.
Actually, the parameters passed in the example above are exactly the default values in case you don't specify an
extent. If you want the brush extent to cover the whole SVG area, don't even bother setting it.

The second call is a request to listen for events coming from the user interaction with the rectangle. Whenever the user
presses left mouse button over the brush rectangle, `start` is fired. With the button pressed, for every mouse movement
event there will be a `brush` event. Finally, when the user releases the mouse button, and `end` event will be fired. So
the first parameter is a list of space-separated event names to listen to, and the second one is a function that will be
called whenever any of those events are fired. More on the callback function later.

## The brush handle

After the brush object is created, you can apply it to a `g` element in your SVG. A semi-transparent rectangle will be
magically appear and let you interact with it:

    d3.select('svg').append('g')
        .call(brush)
        .call(brush.move, [0, width]);

The first call above applies the brush object to the D3 selection, i.e., the group element we just created inside the
SVG element. What happens internally is that `brush()` is called with `this` set to the D3 selection (but beware that
the selection must always be of group elements). `brush()` will then create all the paraphernalia necessary for the
handle to exist.

The second call then sets the initial selected area. Not only `brush` is callable, it has a property `move` which is
also a function per se. `brush.move()` acts on the current selection, changing the rectangle handle to cover the area
designated by the second parameter. This looks a bit cryptic, so let me explain a little further. `call()` calls the
first parameter passing the current selection as `this` and it also takes the parameters that follow and pass them to
your callback. In the example above, this is what will happen internally:

    brush.move.call(currentSelection, [0, width]);

Where `currentSelection` is the current D3 selection. Remember that [`Function.prototype.call()`][1] accepts as first
parameter the object that will bind to `this` when the function is called.

So after the code above is executed, an interactive handle appears. Say your SVG is showing the whole data set, but you
want the handle overlay to cover only the second quarter of the data. Instead of passing `[0, width]`, you now want:

    const quarter = width / 4;
    const start = quarter;
    const end = 2 * quarter;
    d3.select('svg').append('g')
        .call(brush)
        .call(brush.move, [start, end]);

You'll probably also have D3 scale defined. In that case, it is probably better to speak in terms of your domain. For
instance:

    const scale = d3.scaleLinear().domain([0, 100]).range([0, width]);

Your domain goes from 0 to 100 and the scale maps to your SVG width. If you want your handle to cover, say, all data
from 50 to 75:

    d3.select('svg').append('g')
        .call(brush)
        .call(brush.move, [scale(50), scale(75)]);

## The event callback

Now to the event callback. When you first created your brush object, you defined a callback for brush events (we called
it `brushed` - that's how docs' examples usually refer to it). Now it's time to do something with it.

Inside your callback, `this` will point to the current DOM element selected, but the really important piece of
information you'll want resides in the global object `d3.event`. As a side note, I don't really like the way D3 does
this; I would prefer to receive the event as a parameter to the callback instead. Anyway, [Mike][2] must have his
reasons to expose it as a global object.

`d3.event` has the following interesting properties:

* `target`: this is the brush object you created;
* `type`: the brush event that triggered this callback (one of `start`, `brush` or `end`);
* `selection`: an array of two elements where the first one is the left position of the brush handle and the second one
  is its width. You can pass this to your scale object to get your domain-equivalent range.

Let's play with `selection`:

    const [rangeStart, rangeEnd] = d3.event.selection;
    console.info(`Selected range: [${rangeStart}, ${rangeEnd}]`);

This will print the selection to your browser console. Now let's map it to our domain:

    const domainStart = scale.invert(rangeStart);
    const domainEnd = scale.invert(rangeEnd);
    console.info(`Selected domain: [${domainStart}, ${domainEnd}]`);

Here we used our scale object to map a range back to our domain via scale's `invert()` method.

[1]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/call
[2]: https://github.com/mbostock
[3]: https://github.com/d3/d3-brush
