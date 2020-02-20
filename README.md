# [El15ande.github.io](https://el15ande.github.io/)

This page is served by [Github Pages](https://pages.github.com/) & [Jekyll](https://jekyllrb.com/), framework cloned from [Jekyll-now](https://github.com/barryclark/jekyll-now).

## Blogs links

1. [Hello Jekyll: Build Personal Webpage With GithubPage & Jekyll](https://el15ande.github.io/Hello-Jekyll/) - 11/02/2019
2. [Software Engineering In A Nutshell: FAQ & Answers From Ian Sommerville](https://el15ande.github.io/Software-Engineering-FAQ/) - 09/04/2019
3. [JavaScript Variables Declaration Mysteries: Variable Hoisting & Temporal Dead Zone](https://el15ande.github.io/JS-Variable-Mysteries/) - 24/07/2019
4. [Software Architecture Study \[1\]: Overview & Design Decisions](https://el15ande.github.io/SA-Study-1/) - 28/11/2019
5. [Software Architecture Study \[2\]: Styles](https://el15ande.github.io/SA-Study-2/) - 06/01/2020

## Development

### Structure

1. index.html: homepage
2. bloglist.html: blogs indices page
3. _posts: all blogs written in markdown
4. about.md: personal information page
5. 404.md: 404 fault

### Page construction

- [x] Substitute old website by new Jekyll-now framework
- [x] Inject personal information
- [x] Rewrite website structure: home + blogs + about
- [x] Write a fixed blog standard

### Blog standard

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
    ###### _Keyword: <keywords>_
    ```
3. Blog paragraph:
    ```
    ## <title>
    <content>
    ```
4. Break line between English & Chinese translation:
    ```
    <hr>
    ```
5. End with name & place
    ```
    ###### _<author>, <place>_
