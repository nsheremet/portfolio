# Portfolio redesign

Full redesign of the homepage and collection template. Existing photos, series, descriptions, dates, image processing and gallery JavaScript remain intact. The site represents photography broadly; street photography describes only the Cambridge series.

## Final picks

- Darkroom amber, dealt 2/3; local Sofia display and existing Recursive body type.
- Photograph-led opening. Mobile shows the complete photograph above the title.
- Capped layout, collection index, compact collection introduction and contact footer.
- No stock images, invented claims, extra sections, runtime dependencies or deleted files.
- Hero review: two findings, both resolved (surname wrap and mobile crop).
- Finish review: ship, no actionable findings, no missing material.

## Verification

- Before: 39 Floor failures, 7 Reflex findings.
- After: 0 Floor failures, 0 unresolved Reflex findings, 0 warnings.
- Two documented waivers: short collection introduction (44c); the user's own portfolio photographs occupying the gallery (83).
- Dismissed: 28ch one-sentence hero lede (25); section-count heuristic on a portfolio with one published series (77).
- Kept inventory: 15/15 link destinations, 3/3 distinct headings, 1/1 recorded numerical figure.
- Strict minified Hugo production build passed.
- `node scripts/check-site.mjs` passed production, drafts, a deployment subpath, image metadata, viewer hooks and local assets.
- Chrome at 320, 375, 768, 1280 and 1920px: no overflow, image distortion or gallery overlap; all nine photographs loaded.
- Keyboard, previous/next wrapping, close, fullscreen, focus return, synthetic touch swipe and no-JavaScript image fallback passed. No runtime errors.
- Safari, Firefox and physical touch devices were not checked. Nothing was deployed.

## Copy adjustments

The biography and collection descriptions are unchanged.

| Before | After | Reason |
| --- | --- | --- |
| Photographer above the title | Photographer in the footer | Move the eyebrow into the colophon |
| Selected work / 001 | Existing 01 collection count | Consolidate duplicate collection count |
| View collections followed by a down arrow | View collections | Remove decorative link suffix |
| 01 and Collection above the series title | 01 Collection beneath the title | Move the eyebrow into the metadata |
| BW / 2026 / 09 frames | bw / 2026 and 09 frames in separate spans | Sentence-case metadata |
| View collection followed by a diagonal arrow | View collection | Remove decorative link suffix |
| BW / 2026 above the collection title | bw and 2026 below the description | Metadata instead of an eyebrow |
| UNDATED fallback | Undated | Sentence case |

## Material

No placeholder slots or replacement images are needed. The homepage uses the newest collection cover: up to 1312px wide, cropped on desktop, original ratio on mobile. Collection previews and gallery images retain their full ratios. A second series of the photographer's own work is the next useful addition when available.

The generated comparison is `.hallmark/compare.html`; before and after captures are in `.hallmark/before/` and `.hallmark/shots/` (ignored by Git).
