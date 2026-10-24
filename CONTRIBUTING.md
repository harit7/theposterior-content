# Contributing

Thanks for helping. Everything here arrives as a pull request and is reviewed before it goes live.

## Fix something

Every post on the site has a "Suggest an edit on GitHub" link that opens its file here. Make the change and GitHub walks you through opening a pull request. For anything beyond a typo, say what was wrong and how you know. Accepted corrections are added to the post's `updated` list, which appears as its changelog, and you're added to its `contributors`.

To report a problem without fixing it yourself, open an issue with the "Correction" template.

## Write a post

1. Open an issue with the "Post idea" template: what the post explains, who it's for, and what code or data it uses.
2. Once we agree, fork this repository and copy an existing post folder as a starting point.
3. Add yourself in `authors/<your-id>.yaml` with `name`, `bio`, and optionally `url` and `github`.
4. Run `npm install && npm run validate`, then open a pull request. Set `draft: true` while you're still writing; drafts never appear on the site.

## What a post can contain

Posts are MDX: Markdown plus a few building blocks the site provides. Posts don't import anything and contain no code that runs, which keeps the site safe to build from community contributions.

- **Citations:** write `[@key]` in the text and list each key under `references` in the front matter. They become numbered links.
- **Margin notes:** `<Sidenote>text</Sidenote>` right after the word it explains.
- **Figures:** `<Figure caption="...">` around an image or chart. Figures are numbered automatically. Images go in the post's folder.
- **Math:** LaTeX, `$x$` inline and `$$ ... $$` on its own line.
- **Interactive charts:** the site provides a small set, listed in `components.md`. If your post needs a new one, describe it in your pitch and we'll build it into the site.

Allowed in components: text, numbers, `true`/`false` and lists of strings. Not allowed: `import`, `export` and `{...}` expressions.

## Front matter

Every post needs `title`, `summary` (300 characters at most), `authors`, `date` and, if it makes claims, `code`. Paper notes also need a `paper` block and a `confidence` of `low`, `medium` or `high`, and use these sections in order: The problem, The idea, What the evidence shows, Open questions, My take.

## Licenses

By contributing you agree to publish writing, figures and data under CC BY 4.0, and code snippets under MIT. You keep your copyright.
