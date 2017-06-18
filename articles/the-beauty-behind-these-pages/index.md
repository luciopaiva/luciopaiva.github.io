
# The Beauty Behind These Pages

In this article I explain how I made my personal home page using vanilla Javascript and GitHub Pages.

There's a handful of possibilities out there if you want to make your own static home page. First, you don't want expensive hosting services, since all you need is some basic server to provide browsers with your static content, no extra server-side work required. You could use AWS S3 for that, or you could just use **GitHub Pages** and even version your page at the same time... and that's what I chose.

And then there is Jekyll. GitHub supports it and I have a close friend who is [using it in his blog][bernardo]. But it so happens that I am averse to having to compile, build or do any kind of post-processing to my Javascript code. What I like the most in a scripting language is the possibility of just hitting the "play" button and watch it live, no bureaucracy involved. That's why I never really liked Grunt, and why I decided to give up on Typescript in favor of pure ES6. So **my page won't have any kind of building system**.

And that's also why I decided to go vanilla with my page as much as I can. The beauty comes with simplicity. I want to write HTML, CSS and Javascript and see it working right off the bat. I also want to breathe 21st century Javascript, so **ES6** for the win... and I don't mind if it doesn't work in Microsoft's browsers; I instead prefer my code to look beautiful.

For page styling, of course, **Bootstrap**. It makes your page beautiful and it gives you license to stick your layout inside your HTML again, guilty-free (yes, to me these grid systems are nothing but a license to rape tableless design and go back to the 90's... but that's fine by me; they work pretty well and the job gets done quickly).

A couple of years ago, the next thing I would mention would be jQuery. To me, jQuery saved the web and prevented the death of thousands of web developers who would most certainly end their lives otherwise, given the mess the web was before John Resig came to free us all from Microsoft's evil plan to destroy the world with a mass-destruction weapon named IE. But now the future has arrived, at last. ES6 is here, Microsoft lost its market share and jQuery is not needed anymore. That's OK if you want to use it, though. I can understand. It's magical. But believe me, you don't need it anymore. So long, John, and thanks for all the fish. We love you.

There is a new guy in town, though. His name's Mike Bostock and he came up with an awesome toolkit called D3. I expect to use it extensively in my articles since I love data visualization, so I'll keep it around from the beginning. If you still haven't heard of it, stop everything you are doing and [go take a look][d3].

The most important thing here however is content. I need to have something interesting to show in my page. I want to write articles like this one and I want it to be pain-free, so I can focus on what I have to say instead of wasting my time finding out why my build system broke after I updated `npm` to the next version. Someone who likes Jekyll could tell you: "see, that's the good thing about it, you can write your articles in Markdown and your articles will shine in all their glory". Well, I say fuck Jekyll! I'll come up with my own way to write in Markdown and still make it work with my "buildless" system :-P

And here is [marked][marked] to the rescue. It does on-the-fly Markdown parsing on the client side; so no need to pre-process anything. You can calmly write your article and then call marked to parse it for you. Heck, we can even write it in a separate file and make Javascript load it for us inside our HTML:

    window.addEventListener('load', () => {
        d3.text('index.md', (error, data) => {
            const element = document.getElementById('contents');
            element.innerHTML = marked(data);
        });
    });

The code first waits for the `load` event to be triggered, meaning the page has finished loading. When that happens, it asks `d3` to load our Markdown file as plain text, which then gets passed to `marked` so it can turn the article into proper HTML and stuff it into a `div` element we have just for that.

And that's about it for now. My page is still a work in progress, so I intend to continue this discussion shortly.

To be discussed:

- template index.html to load the Markdown file
- dynamic loading of meta data, SEO-friendly
- syntax highlighting

[bernardo]: http://www.bernardopacheco.net
[marked]: https://github.com/chjj/marked
[d3]: https://d3js.org
