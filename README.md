# El15ande.github.io

My simple [Github Pages](https://pages.github.com/) blog.

## Project Setup

- Install dependencies: `gem install bundler jekyll`
- Build site: `jekyll serve`
- Start localhost preview: `jekyll serve`

#### Blog Structure

- `_data/projects.yml`: Project metadata that will appear in `/projectlist/`.
- `_layouts/`
  - `default.html`: The blog scaffold.
  - `post.html`: The template of all posts.
- `_posts`: All posts that will appear in `/bloglist/`.
- `_config.yml`: Blog metatdata.
- Individual HTMLs
  - `404.html`: Void.
  - `bloglist.html`: `/bloglist/` template.
  - `index.html`: Blog entry.
  - `project.html`: `/projectlist/` template.
  - `resume.html`: `/resume/` online résumé.

#### Tech. Stack

- [Jekyll](https://jekyllrb.com/)
  - [Jekyll-now](https://github.com/barryclark/jekyll-now)