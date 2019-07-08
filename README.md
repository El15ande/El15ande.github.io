# [El15ande.github.io](https://el15ande.github.io/)

This page is served by [Github Pages](https://pages.github.com/) & [Jekyll](https://jekyllrb.com/), framework cloned from [Jekyll-now](https://github.com/barryclark/jekyll-now).

## Structure

1. index.html: homepage
2. bloglist.html: blogs indices page
3. _posts: all blogs written in markdown
4. about.md: personal information page
5. 404.md: 404 fault

## Page construction

- [x] Substitute old website by new Jekyll-now framework
- [x] Inject personal information
- [ ] Rewrite website structure: home + blogs + about
- [x] Write a fixed blog standard

## Blog standard

1. Jekyll title:
    ```
    ---
    layout = post
    title = <blog title>
    date = <Y-M-D>
    ---
    ```
2. Subtitle:
    ```
    <hr>
    Keyword: <keywords>
    ```
3. Blog paragraph:
    ```
    ## <title>
    <content>
    ```
4. End with name & place