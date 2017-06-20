"use strict";

/**
 * Responsible for loading an article in the page.
 *
 * 2017-06-19: I am trying to make article loading smarter, but I'm still not successful. Although I could start loading
 * the article right away when my script is loaded, I still need for d3 and marked to be loaded. d3 is the biggest one,
 * so it ends up queueing my script (since I need to defer it to after d3 is loaded) and then the markdown file gets
 * postponed. One way to avoid waiting for d3 is to implement my own ajax request, which I might do at some point.
 */
class Article {

    constructor () {
        this.contentsElement = null;
    }

    /**
     * Loads the Markdown with the article to be displayed.
     * This method may be called *before* the DOM finishes loading, so avoid querying for DOM elements at this point.
     * @return {void}
     */
    async load() {
        const documentLoaded = new Promise(resolve => document.addEventListener('DOMContentLoaded', resolve));

        // start downloading markdown file as soon as possible
        const markdownLoaded = new Promise(this.loadMarkdown.bind(this));

        // wait for both the DOM and the markdown file to be loaded
        const [ignored, parsedMarkdown] = await Promise.all([documentLoaded, markdownLoaded]);

        this.updatePage(parsedMarkdown);
    }

    /**
     * Asynchronously loads the Markdown file.
     * @param {function} resolve - called if loading is successful
     * @param {function} reject - called if something goes south
     */
    loadMarkdown(resolve, reject) {
        d3.text('index.md', (error, data) => {
            if (error) {
                reject(error);
            } else {
                // parse markdown
                marked.setOptions({
                    highlight: code => hljs.highlightAuto(code).value
                });

                const parsedMarkdown = marked(data);

                resolve(parsedMarkdown);
            }
        });
    }

    /**
     * Here the DOM is guaranteed to be loaded, so let's go ahead and update the page with the article loaded.
     * @param {string} parsedMarkdown - the markdown that was just parsed into HTML
     */
    updatePage(parsedMarkdown) {
        this.contentsElement = document.getElementById('contents');
        this.contentsElement.innerHTML = parsedMarkdown;

        // marked does not let Hightlight.js add `hljs` class to pre elements as it should
        for (const pre of this.contentsElement.querySelectorAll('pre')) {
            pre.classList.add('hljs');
        }

        // extracts the first H1 as the page title and the first phrase as the page description
        const pageTitle = this.contentsElement.querySelector('h1').innerText;
        const descriptionResult = this.contentsElement.querySelector('p').innerText.match(/[^.]+/) || [''];

        // fill in page meta data
        document.title = pageTitle;
        document.querySelector('meta[name="description"]').setAttribute('content', descriptionResult[0]);
    }
}

(new Article()).load();
