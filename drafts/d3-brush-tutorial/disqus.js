
const disqus_config = function () {
    this.page.url = '#DISQUS_PAGE_URL#';
    this.page.identifier = '#DISQUS_PAGE_IDENTIFIER#';
};
(function() {
    const s = document.createElement('script');
    s.src = 'https://luciopaiva.disqus.com/embed.js';
    s.setAttribute('data-timestamp', (new Date()).getTime().toString());
    document.head.appendChild(s);
})();
