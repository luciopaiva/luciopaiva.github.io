"use strict";

/**
 * Responsible for loading an article in the page.
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
    async fetchArticle() {
        // start downloading markdown file as soon as possible
        const rawArticle = await this.fetch('index.md');

        // wait here until Marked and other libraries are already loaded
        await this.waitForFullPageLoad();

        this.updatePage(this.parseMarkdown(rawArticle));
    }

    /**
     * Waits for the page to be fully loaded, scripts and stylesheets included.
     * @returns {Promise}
     */
    waitForFullPageLoad() {
        if (!this.pageLoadingPromise) {
            // this is the first call; prepare the promise
            this.pageLoadingPromise = new Promise(resolve => {
                if (document.readyState !== 'complete') {
                    // document is still loading, so listen for event
                    window.addEventListener('load', resolve);
                } else {
                    // page is already completely loaded
                    resolve();
                }
            });
        }
        // subsequent calls are just going to return the original promise, be it fulfilled or not
        return this.pageLoadingPromise;
    }

    /**
     * Asynchronously fetch a file, returning its contents in plain text.
     * @param {string} url - URL to fetch
     * @returns {Promise} a promise to the response (upon success) or the XMLHttpRequest instance (in case of a failure)
     */
    async fetch(url) {
        return new Promise((resolve, reject) => {
            const httpRequest = new XMLHttpRequest();
            httpRequest.onreadystatechange = () => {
                if (httpRequest.readyState === XMLHttpRequest.DONE) {
                    if (httpRequest.status === 200) {
                        resolve(httpRequest.responseText);
                    } else {
                        reject(httpRequest);
                    }
                }
            };
            httpRequest.open('GET', url);
            httpRequest.send();
        });
    }

    /**
     * @param {string} rawData - the data to be parsed as Markdown
     * @return {string} resulting HTML
     */
    parseMarkdown(rawData) {
        // parse markdown
        marked.setOptions({
            highlight: code => hljs.highlightAuto(code).value
        });

        return marked(rawData);
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
        const paragraphs = this.contentsElement.querySelectorAll('p');
        const descriptionResult = paragraphs[0].innerText.match(/[^.]+/) || [''];

        // fill in page meta data
        document.title = pageTitle;
        document.querySelector('meta[name="description"]').setAttribute('content', descriptionResult[0]);
    }
}

(new Article()).fetchArticle();
