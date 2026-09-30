# Zero to Build

Interactive teaching deck for Noise technical tutorials, session 01: "Zero to build: vibe coding in the terminal."

Noise internal training. Walk in with no coding experience, leave with a platform of your own.

## Stack

Next.js (via vinext) exported as a static site, deployed to GitHub Pages on push to `main`.

## Develop

```
npm ci
NEXT_PUBLIC_REPORT_BASE_PATH=/zero-to-build npm run build
node scripts/export-pages.mjs
```

Output lands in `pages-dist/`. The workflow in `.github/workflows/pages.yml` does the same and publishes to Pages.
