// Using good old pre-ES6 Javascript for the sake of SEO. As of the time of this writing, Googlebot does not support ES6
(function () {
    "use strict";

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

    function parseMarkdown(rawData) {
        marked.setOptions({
            highlight: function (code) {
                return hljs.highlightAuto(code).value;
            }
        });
        return marked(rawData);
    }

    function updatePage(parsedMarkdown) {
        var
            pageTitle,
            paragraphs,
            descriptionResult,
            contentsElement = document.getElementById('contents');

        contentsElement.innerHTML = parsedMarkdown;

        // marked does not let Highlight.js add `hljs` class to pre elements as it should
        contentsElement.querySelectorAll('pre code').forEach(function (pre) {
            pre.classList.add('hljs');
        });

        // extracts the first H1 as the page title and the first phrase as the page description
        pageTitle = contentsElement.querySelector('h1').innerText;
        paragraphs = contentsElement.querySelectorAll('p');
        paragraphs[0].classList.add('last-updated');
        paragraphs[0].innerHTML = 'Last update: ' + paragraphs[0].innerHTML;
        descriptionResult = paragraphs[1].innerText.match(/[^.]+/) || [''];

        // fill in page meta data
        document.title = pageTitle;
        document.querySelector('meta[name="description"]').setAttribute('content', descriptionResult[0]);
    }

    fetch('index.md', function (errorCode, rawArticle) {
        var markdownArticle = parseMarkdown(rawArticle);
        updatePage(markdownArticle);
    })
})();
