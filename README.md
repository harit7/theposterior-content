# The Posterior: content

Posts, leaderboards and data for [theposterior.net](https://theposterior.net). The website itself is built from a separate repository; this one holds only the writing and the numbers, so anyone can propose a fix or a new post.

## What's here

| Folder | What it holds |
|---|---|
| `posts/<slug>/index.mdx` | Posts, one folder each |
| `leaderboards/<slug>/index.mdx` | Leaderboard pages, with their data in `leaderboards/<slug>/data/` |
| `papers/<slug>/index.md` | Paper notes |
| `notes/<slug>.md` | Short notes |
| `series/<id>.yaml` | Multi-part series; posts join one with a `series` field |
| `authors/<id>.yaml` | One file per author |

Every number in a leaderboard comes from the CSV files next to it, and every post that makes a claim links to its code.

## How changes get in

The `main` branch is protected. All changes, including the maintainer's, arrive as pull requests and are reviewed before merging. When a pull request is merged, the website rebuilds within a few minutes.

To check your changes before opening a pull request:

```bash
npm install
npm run validate
```

See [CONTRIBUTING.md](CONTRIBUTING.md) for how to fix something, write a post, or add data.

## Licenses

Writing, figures and data are under [CC BY 4.0](LICENSE.md). Code snippets inside posts are under the MIT license.
