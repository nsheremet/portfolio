# Nazarii Sheremet

Minimal photo gallery built with Hugo page bundles.

## Run locally

```sh
hugo server --buildDrafts --renderToMemory
```

Open <http://localhost:1313/>. The included draft collection demonstrates the UI but is excluded from normal builds.

## Add a collection

Create a folder under `content/collections/`:

```text
content/collections/winter-coast/
  index.md
  01.jpg
  02.jpg
  03.jpg
```

Use lowercase, zero-padded filenames to control photo order. Keep web-ready JPEG, PNG, or WebP files here; remove location metadata and keep RAW originals elsewhere.

`index.md` contains YAML metadata and an optional Markdown introduction:

```yaml
---
title: Winter Coast
date: 2026-01-18
presentation: bw # color | film | bw
cover: 03.jpg     # optional; first photo otherwise
captions:
  02.jpg: Fog lifting above harbour.
---

Optional collection introduction.
```

Captions are optional. They also provide image alternative text; uncaptained images receive a collection-and-position fallback.

## Check the site

```sh
hugo --buildDrafts --panicOnWarning --minify
```
