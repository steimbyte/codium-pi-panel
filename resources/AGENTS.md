# AGENTS.md — resources/

## Purpose

Static assets shipped with the extension. Currently: one SVG icon used in the Activity Bar and TreeView.

## Ownership

- `pi-icon.svg` — referenced by `package.json` in `viewsContainers.activitybar[0].icon` and `views.piPanel[0].icon`

## Local Contracts

- Format: SVG (allowed because `pi-icon.svg` is NOT a README reference — vsce only restricts SVG in README.md)
- Theme: uses `fill="currentColor"` so VSCode's light/dark theme is respected automatically
- Dimensions: `viewBox="0 0 24 24"`, `width="24" height="24"` — standard VSCode activity bar icon size
- Content: π (Greek letter) symbol in serif font

## Work Guidance

- Do not embed raster icons — SVG with `currentColor` is required for theme adaptivity
- New icons follow the same 24×24 viewBox
- Icon file names use kebab-case: `<name>-icon.svg`

## Verification

- Open in Codium Activity Bar — π visible, color follows theme
- Open in light theme — π still visible (uses `currentColor`, not hardcoded black)
