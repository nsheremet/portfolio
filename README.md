# Nazarii Sheremet

Minimal photo gallery built with Hugo page bundles.

Collection photographs keep their full aspect ratios in a responsive masonry layout; no collection metadata is needed for sizing.

Typography uses Recursive 1.085 under the SIL Open Font License 1.1; Latin subsets load on demand, with system-monospace fallback for other scripts. The bundled license is in `static/fonts/recursive-OFL.txt`.

## Run locally

```sh
hugo server --buildDrafts --renderToMemory
```

Open <http://localhost:1313/>. The included draft collection demonstrates the UI but is excluded from normal builds.

Edit `content/_index.md` to change the homepage biography. Add `contact: mailto:you@example.com` under `params` in `hugo.yaml` to show the header contact link.

## Add a collection

Create a folder under `content/collections/`:

```text
content/collections/winter-coast/
  index.md
  01.jpg
  02.jpg
  03.jpg
```

Use lowercase, zero-padded filenames to control photo order. Export in sRGB at roughly 2400–3000 px on the long edge; remove location metadata and keep RAW originals elsewhere.

The homepage builds each collection's colour fingerprint from its cover automatically.

`index.md` contains YAML metadata and an optional Markdown introduction:

```yaml
---
title: Winter Coast
date: 2026-01-18
presentation: bw # color | film | bw
cover: 03.jpg     # optional; first photo otherwise
captions:
  02.jpg: Fog lifting above harbour.
# Optional when visible caption is not a useful image description:
alt:
  02.jpg: Fishing boats disappearing into dense harbour fog.
---

Optional collection introduction.
```

Captions are optional and also provide image alternative text. Use the optional `alt` map when a visible caption is not descriptive. Build fails when a caption or alt filename does not match a photo.

## Check the site

```sh
hugo --buildDrafts --panicOnWarning --minify
```

## Deploy to GitLab Pages

The included pipeline builds the default branch with GitLab's `CI_PAGES_URL`, so local `baseURL` can remain unchanged. Add a GitLab remote and push when ready; do not commit `public/`.

## Deploy to GitHub Pages

The GitHub Actions workflow builds `main` with the repository's Pages URL and deploys `public/` as an artifact. In the GitHub repository, set **Settings → Pages → Source** to **GitHub Actions**. Local `baseURL` remains unchanged.
