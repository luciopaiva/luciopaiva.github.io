"use strict";


class Article {

    static load() {
        // window.addEventListener('load', () => {
            console.info('Going to load article.');

            d3.text('index.md', (error, data) => {
                if (error) throw error;

                marked.setOptions({
                    highlight: code => hljs.highlightAuto(code).value
                });

                const element = document.getElementById('contents');
                element.innerHTML = marked(data);

                // marked does not let Hightlight.js add `hljs` class to pre elements as it should
                for (const pre of element.querySelectorAll('pre')) {
                    pre.classList.add('hljs');
                }

                // extracts the first H1 as the page title and the first phrase as the page description
                const pageTitle = element.querySelector('h1').innerText;
                const descriptionResult = element.querySelector('p').innerText.match(/[^.]+/) || [''];

                document.title = pageTitle;
                document.querySelector('meta[name="description"]').setAttribute('content', descriptionResult[0]);
            });
        // });
    }
}

Article.load();
