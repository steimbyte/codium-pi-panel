# AGENTS.md — codium-pi-panel

## Purpose

VSCode/Codium extension that:
- On startup, opens a terminal as an editor tab in the right split and runs `pi`
- Provides a π-button in the Activity Bar and a π-item in the Status Bar — each click spawns a new Pi terminal in the right split

## Ownership

- Repo: https://github.com/steimbyte/codium-pi-panel
- Publisher: `your-publisher`
- Current version: `0.1.0`

## Local Contracts

- `activationEvents`: `onStartupFinished` — fires once, never during debug
- `vscode.ViewColumn.Beside` (`-2`) — terminal appears as editor tab in new right-side split group
- `hasActivated` runtime guard — prevents double-fire on re-activation
- Command `piPanel.open` — spawns new Pi terminal, registered in `package.json` contributes
- Activity Bar container: `piPanel` (left strip)
- TreeView: `piPanel.view` (single clickable item)
- StatusBarItem: alignment `Left`, priority `100`, command `piPanel.open`
- Icon: `resources/pi-icon.svg` (π symbol, dark/light theme adaptive via `currentColor`)

## Build & Release

- `npm run compile` → `dist/extension.js`
- `npx vsce package` → `pi-panel-<version>.vsix`
- `codium --install-extension pi-panel-<version>.vsix`
- `gh release create v<version> pi-panel-<version>.vsix --generate-notes`

## Work Guidance

- README must use `.png` (not `.svg`) for Ko-fi button — vsce rejects SVG image references
- All `git commit` and `git push` after every meaningful change
- VSIX binary files are gitignored but committed as release assets via `gh release`

## Verification

- `npx vsce package` must complete without `ERROR` (warnings ok)
- Reload Codium and confirm:
  - On startup: editor splits, right tab = Pi Terminal running `pi`
  - Activity Bar: π-icon visible left
  - Status Bar: `π Pi` visible bottom-left
  - Each click on either button = fresh terminal in right split with `pi` running

## Child DOX Index

| Path | Doc | Scope |
|------|-----|-------|
| `src/` | [src/AGENTS.md](src/AGENTS.md) | Extension source code |
| `resources/` | [resources/AGENTS.md](resources/AGENTS.md) | Static assets (icons) |
