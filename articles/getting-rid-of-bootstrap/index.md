
# Getting Rid of Bootstrap

- divitis: avoid excessive use of divs just to make things work; CSS grid will help with that;
- mobile first: start development testing for mobile first (using Chrome dev tools); this helps focusing on stuff that really matters to the page, since mobile space is limited. Then add extra things to desktop only if you think you really must;
- progressive enhancement: start by making it work as simple as possible, not anything fancy. Once it's working, add stuff via media queries, checking first if the browser support it (for instance, adding CSS grid stuff)
