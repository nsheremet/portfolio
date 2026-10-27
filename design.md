# Design: Nazarii Sheremet

One visual system for the portfolio and every collection. The portfolio represents all photography; a collection's subject does not define the photographer's specialism.

## System

- Genre: atmospheric.
- Theme: Darkroom, amber colourway; locally hosted Recursive retained for body text.
- Homepage: photograph-led opening, collection index, contact colophon.
- Collection: title and introduction, uncropped photographs, existing fullscreen viewer.
- Palette: warm black surfaces, fibre-white text, amber only for the main action and focus states.
- Keep the photographs' original colour and tonal treatment. No filters or added grain.

## Tokens

`assets/css/tokens.css` is the source of truth.

```css
:root {
  --color-paper: oklch(12.5% 0.008 55);
  --color-paper-2: oklch(16% 0.009 55);
  --color-ink: oklch(92% 0.012 78);
  --color-muted: oklch(72% 0.012 65);
  --color-rule: oklch(29% 0.01 55);
  --color-accent: oklch(73% 0.15 58);
  --color-accent-ink: oklch(12.5% 0.008 55);
  --color-focus: oklch(73% 0.15 58);
  --font-display: "Sofia Sans Extra Condensed", ui-sans-serif, sans-serif;
  --font-body: "Recursive", ui-sans-serif, sans-serif;
  --radius-card: 0;
}
```

## Composition and controls

- One centred 1440px container, including its responsive gutters.
- Fine uppercase display headings; sentence-case, untracked body and navigation.
- Amber primary action, 48px high. Quiet text links elsewhere.
- Instant visible focus rings. Viewer controls remain keyboard and touch accessible.
- Mobile opening shows the complete photograph above the title and action.
- Gallery pictures keep their aspect ratios. Masonry's fallback uses 8px rows.
- Content stays visible without JavaScript; image links open the image directly.

## Motion and exports

Still photographs, no ornamental motion. Reduced-motion styles remove transitions.
Hugo bundles the token, base and page styles into one local asset. All fonts are local.
