# AI Money Lab

A thought experiment: ideas for making money with AI, each run through the same gauntlet
(desk research → conversations → smoke test → first money). Ideas that survive are worth doing.

- `ideas.json` holds all the content: rubric, stages, ideas, competitors, sources. Edit this, not the HTML.
- `index.html` + `app.js` + `style.css` render it. Open via a local server (`fetch` doesn't work from `file://`):
  `python -m http.server 4196 --directory C:/projects/work/aistartup`
- `research/` holds longer notes per idea.

## Keeping it out of search engines and AI crawlers

What's in place:
1. Every page has `<meta name="robots" content="noindex, nofollow, noarchive, ... noai, noimageai">`.
   Google, Bing and most well-behaved crawlers respect `noindex`. `noai`/`noimageai` are informal and only some honor them.
2. `robots.txt` in this repo blocks everything, including AI crawlers by name.

The limits:
- **Crawlers only read `robots.txt` at the root of a host.** On `southocean.github.io/aistartup/`, the root is
  `southocean.github.io/robots.txt`, which comes from a separate repo, `southocean/southocean.github.io`
  (it doesn't exist yet). To make robots.txt actually work, that repo needs a root robots.txt with
  `Disallow: /aistartup/`, which leaves the other sites (callback, etc.) indexable.
- robots.txt and meta tags are **requests, not locks**. Reputable crawlers comply; scrapers may not.
- **A public repo is public**: anyone can read it on github.com, and GitHub's own pages for the repo can be
  indexed regardless of the site's tags. For truly private notes, keep the repo private
  (GitHub Pages from a private repo needs a paid plan) or keep it local-only.
