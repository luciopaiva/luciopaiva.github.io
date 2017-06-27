
const disqus_config = function () {
    this.page.url = 'http://luciopaiva.com/articles/the-beauty-behind-these-pages';
    this.page.identifier = '1000';
};
(function() {
    const s = document.createElement('script');
    s.src = 'https://luciopaiva.disqus.com/embed.js';
    s.setAttribute('data-timestamp', (new Date()).getTime().toString());
    document.head.appendChild(s);
})();
