
# Steps to add a new article

1. create a new folder under `articles/` and name it after the article you are going to write

2. copy file `index.html` from any other existing article into your new folder

3. look for disqus configuration at the end of `index.html` and change the following vars:

  - `this.page.url`: should point to your new article's URL
  - `this.page.identifier`: change this to the next identifier available (look for the most recent one among all other articles)

4. update `articles.data` with info about your new article:

  - title
  - last update date
  - description
  - URL

5. update file `sitemap` with the new article's URL
