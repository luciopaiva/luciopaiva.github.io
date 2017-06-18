"use strict";


class HomePage {

    constructor () {
        console.info('Initializing...');

        this.maxGists = 10;
        this.maxArticles = 10;
        this.maxProjects = 100;

        this.projectTemplate = d3.select('#project-template-container > div').node();
        this.projectsContainer = d3.select('#projects-container');
        this.articleTemplate = d3.select('#article-template-container > li').node();
        this.articlesContainer = d3.select('#articles-container');
        this.gistTemplate = d3.select('#gist-template-container > li').node();
        this.gistsContainer = d3.select('#gists-container');

        d3.text('projects.data', (error, data) => this.parseProjects(data));
        d3.text('articles.data', (error, data) => this.parseArticles(data));
        d3.json('https://api.github.com/users/luciopaiva/gists', (error, data) => this.parseGists(error, data));
    }

    /**
     * @param {object} error
     * @param {{ description: string, url: string }[]} data
     */
    parseGists(error, data) {
        if (error) {
            console.error('Error loading Gists.');
            console.error(error);
            return;
        }

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
        const element = HomePage.clone(this.gistTemplate);
        element.select('.gist-description').text(description);
        element.select('.gist-url').attr('href', url);
        HomePage.appendToContainer(element, this.gistsContainer);
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
        const element = HomePage.clone(this.articleTemplate);
        element.select('.article-title').text(title);
        element.select('.article-date').text(dateStr);
        element.select('.article-description').text(description);
        element.select('.article-url').attr('href', url);
        HomePage.appendToContainer(element, this.articlesContainer);
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
        const element = HomePage.clone(this.projectTemplate);
        element.node().addEventListener('click', () => window.location = url);
        element.select('.project-image').style('background', `url(${imgUrl}) center`);
        element.select('.project-title').text(title);
        element.select('.project-description').text(description);
        HomePage.appendToContainer(element, this.projectsContainer);
    }

    static clone(elementNode) {
        return d3.select(elementNode.cloneNode(true));
    }

    static appendToContainer(element, containerSelection) {
        containerSelection.append(() => element.node());
    }
}

window.addEventListener('load', () => new HomePage());
