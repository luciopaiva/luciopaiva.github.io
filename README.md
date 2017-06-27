
# How to write a new article

* Make a copy of `drafts/_template` into `drafts/` folder
  *(Give it a good name; it will be part of your article's URL)*

    cd drafts
    cp _template my-awesome-article

* Edit `index.md` and write your article in it

* Go to the repository root and run:

    ./publish

* Open `articles/my-awesome-article` in a browser and check the results

# What does `build` do?

- Rewrites all `index.html` inside every article folder, updating:
  - article content according to `index.md`
  - page's title
  - page's description
  - article last updated date

---


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

# Points of improvement

Being able to add new articles without too much effort is my main goal with this project. That's why I'm avoiding introducing any kind of build step to it. I want to edit a Markdown file and see it live as soon as I press the refresh button on my browser. My left screen is opened with the Markdown editor, my right one is showing the browser with the page rendered.

That being said, here are some possible improvements:

1. I could have some script to create a new blank article. It would receive the name of the article as a parameter and use that info to automate all aforementioned steps;

2. step 3 (edit disqus configuration) can be automated easily just by adding an id to each entry in `articles.data`

3. drafts would still be written in "sandbox mode", where javascript will be loaded and parsed in the browser, so building required (so we don't need to run any script while writing the article). As soon as the article is ready, we can build it to the `articles` folder
