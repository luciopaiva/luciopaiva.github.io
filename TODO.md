
Next articles:

- Inter-process communication in Electron using async/await
- loading page scripts via `script async` and waiting for DOMContentLoaded in a smart way
  it is going to be nice to write about it, since I'll probably delete that code in favor of statically loading everything offline

Page features and improvements:

- add animated gifs to thumbnails of visualization projects
- remember scroll position for when user refreshes page; browser is unable to remember it correctly because the contents are being loaded after the page has finished refreshing
- marked: allow scrolling of pre tags instead of wrapping code
- code tag in "the beauty behind these pages" is making layout break in mobile devices
- consider building script pages offline instead of assembling them on the fly
  - less files to download
  - it has to wait for d3 to be able to run Ajax
