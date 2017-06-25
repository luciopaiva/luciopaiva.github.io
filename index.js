"use strict";


class HomePage {

    constructor () {
        console.info('Initializing...');

        this.maxGists = 10;
        this.maxArticles = 10;
        this.maxProjects = 100;

        this.pageLoadingPromise = null;  // will hold a promise to the DOM loaded event

        // will be later filled with references to relevant DOM elements
        this.projectTemplate = null;
        this.projectsContainer = null;
        this.articleTemplate = null;
        this.articlesContainer = null;
        this.gistTemplate = null;
        this.gistsContainer = null;

        // fire AJAX downloads asynchronously and join with DOM load event only after each download is complete
        this.fetchArticlesSummary();
        this.fetchProjectsSummary();
        this.fetchGists();
    }

    /**
     * Waits for DOM to load. We don't need window `load` event (which takes place after all scripts and stylesheets
     * have been downloaded), that's why we listen for `DOMContentLoaded`, which takes place right after DOM has
     * finished loading page elements.
     * @returns {Promise}
     */
    waitForDOM() {
        if (!this.pageLoadingPromise) {
            // this is the first call; prepare the promise
            this.pageLoadingPromise = new Promise(resolve => {
                if (document.readyState === 'loading') {
                    // document is still loading, so listen for event
                    document.addEventListener("DOMContentLoaded", () => this.runDOMQueries(resolve));
                } else {
                    // we are past loading, at least "interactive" level, and that's just what we need
                    this.runDOMQueries(resolve);
                }
            });
        }
        // subsequent calls are just going to return the original promise, be it fulfilled or not
        return this.pageLoadingPromise;
    }

    /**
     * Run queries in the DOM.
     * @param {Function} callback - function to be called after everything is done
     */
    runDOMQueries(callback) {
        this.projectTemplate = document.querySelector('#project-template-container > div');
        this.projectsContainer = document.querySelector('#projects-container');
        this.articleTemplate = document.querySelector('#article-template-container > li');
        this.articlesContainer = document.querySelector('#articles-container');
        this.gistTemplate = document.querySelector('#gist-template-container > li');
        this.gistsContainer = document.querySelector('#gists-container');

        callback();
    }

    /**
     *
     * @returns {void}
     */
    async fetchProjectsSummary() {
        const data = await this.fetch('projects.data');
        await this.waitForDOM();
        this.parseProjects(data);
    }

    /**
     *
     * @returns {void}
     */
    async fetchArticlesSummary() {
        const data = await this.fetch('articles.data');
        await this.waitForDOM();
        this.parseArticles(data);
    }

    /**
     *
     * @returns {void}
     */
    async fetchGists() {
        const data = JSON.parse(await this.fetch('https://api.github.com/users/luciopaiva/gists'));
        await this.waitForDOM();
        this.parseGists(data);
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
     * @param {{ description: string, url: string }[]} data
     */
    parseGists(data) {
        if (!data || !(data.length > 0)) {
            console.error('Empty list of gists');
            return;
        }

        for (const gist of data.slice(0, this.maxGists)) {
            this.addGist(gist.description, gist.html_url);
        }

        console.info('Gists loaded: ' + data.length);
    }

    /**
     * @param {string} description
     * @param {string} url
     */
    addGist(description, url) {
        const element = this.gistTemplate.cloneNode(true);
        element.querySelector('.gist-description').innerText = description;
        element.querySelector('.gist-url').setAttribute('href', url);
        this.gistsContainer.appendChild(element);
    }

    /**
     * @param {string} data
     */
    parseArticles(data) {
        const rawArticles = data.split('\n\n');
        for (const rawArticle of rawArticles.slice(0, this.maxArticles)) {
            const [title, dateStr, description, url] = rawArticle.split('\n');
            this.addArticle(title, dateStr, description, url);
        }
        console.info('Articles loaded: ' + rawArticles.length);
    }

    /**
     * @param {string} title
     * @param {string} dateStr
     * @param {string} description
     * @param {string} url
     */
    addArticle(title, dateStr, description, url) {
        const element = this.articleTemplate.cloneNode(true);
        element.querySelector('.article-title').innerText = title;
        element.querySelector('.article-date').innerText = dateStr;
        element.querySelector('.article-description').innerText = description;
        element.querySelector('.article-url').setAttribute('href', url);
        this.articlesContainer.appendChild(element);
    }

    /**
     * @param {string} data
     */
    parseProjects(data) {
        const rawProjects = data.split('\n\n');
        for (const rawProject of rawProjects.slice(0, this.maxProjects)) {
            const [title, url, description, imgUrl] = rawProject.split('\n');
            this.addProject(title, url, description, imgUrl);
        }
        console.info('Projects loaded: ' + rawProjects.length);
    }

    /**
     * @param {string} title
     * @param {string} url
     * @param {string} description
     * @param {string} imgUrl
     */
    addProject(title, url, description, imgUrl) {
        const element = this.projectTemplate.cloneNode(true);
        element.addEventListener('click', () => window.location = url);
        element.querySelector('.project-image').style.background = `url(${imgUrl}) center`;
        element.querySelector('.project-title').innerText = title;
        element.querySelector('.project-description').innerText = description;
        this.projectsContainer.appendChild(element);
    }
}

// no need to wait for DOM to be loaded - let's fire Ajax downloads ASAP
new HomePage();
