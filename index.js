// Using good old pre-ES6 Javascript for the sake of SEO. As of the time of this writing, Googlebot does not support ES6
(function () {
    "use strict";

    var
        MAX_ARTICLES = 10,
        MAX_PROJECTS = 100,
        MAX_GISTS = 10;

    /**
     * @param {string} url
     * @param {function} callback
     */
    function fetch(url, callback) {
        var httpRequest = new XMLHttpRequest();
        httpRequest.onreadystatechange = function () {
            if (httpRequest.readyState === XMLHttpRequest.DONE) {
                if (httpRequest.status === 200) {
                    callback(null, httpRequest.responseText);
                } else {
                    callback(httpRequest.status);
                }
            }
        };
        httpRequest.open('GET', url);
        httpRequest.send();
    }

    function fetchAndParseArticlesSummary() {
        var
            articleTemplate = document.querySelector('#article-template-container > li'),
            articlesContainer = document.querySelector('#articles-container');

        function addArticle(title, dateStr, description, url) {
            var element = articleTemplate.cloneNode(true);
            element.querySelector('.article-title').innerText = title;
            element.querySelector('.article-date').innerText = dateStr;
            element.querySelector('.article-description').innerText = description;
            element.querySelector('.article-url').setAttribute('href', url);
            articlesContainer.appendChild(element);
        }

        fetch('articles.data', function (errorCode, data) {
            var
                rawArticles;

            if (errorCode) {
                console.error('Problem fetching articles: HTTP ' + errorCode);
                return;
            }

            rawArticles = data.split('\n\n').slice(0, MAX_ARTICLES);
            rawArticles.forEach(function (rawArticle) {
                addArticle.apply(null, rawArticle.split('\n'));
            });
        });
    }

    function fetchAndParseProjectsSummary() {
        var
            projectTemplate = document.querySelector('#project-template-container > div'),
            projectsContainer = document.querySelector('#projects-container');

        function addProject(title, url, description, imgUrl) {
            var element = projectTemplate.cloneNode(true);
            element.addEventListener('click', function () { window.location = url; });
            element.querySelector('.project-image').style.background = 'url(' + imgUrl + ') center no-repeat';
            element.querySelector('.project-title').innerText = title;
            element.querySelector('.project-description').innerText = description;
            projectsContainer.appendChild(element);
        }

        fetch('projects.data', function (errorCode, data) {
            var
                rawProjects;

            if (errorCode) {
                console.error('Problem fetching projects: HTTP ' + errorCode);
                return;
            }

            rawProjects = data.split('\n\n').slice(0, MAX_PROJECTS);
            rawProjects.forEach(function (rawProject) {
                addProject.apply(null, rawProject.split('\n'));
            });
        });
    }

    function fetchAndParseGists() {
        var
            gistTemplate = document.querySelector('#gist-template-container > li'),
            gistsContainer = document.querySelector('#gists-container');

        function addGist(description, url) {
            var element = gistTemplate.cloneNode(true);
            element.querySelector('.gist-description').innerText = description;
            element.querySelector('.gist-url').setAttribute('href', url);
            gistsContainer.appendChild(element);
        }

        fetch('https://api.github.com/users/luciopaiva/gists', function (errorCode, data) {
            /** @type {{ description: string, html_url: string }[]} */
            var gists;

            if (errorCode) {
                console.error('Problem fetching gists: HTTP ' + errorCode);
                return;
            }

            if (!data) {
                console.error('Empty response fetching gists');
                return;
            }

            gists = JSON.parse(data);

            if (!Array.isArray(gists)) {
                console.error('Unexpected response fetching gists');
                return;
            }

            gists.slice(0, MAX_GISTS).forEach(function (gist) {
                addGist(gist.description, gist.html_url);
            });
        });
    }

    function run() {
        fetchAndParseArticlesSummary();
        fetchAndParseProjectsSummary();
        fetchAndParseGists();
    }

    run();
})();
