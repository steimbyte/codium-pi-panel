# Codium Pi Panel

> ⭐ If you find this useful, consider [supporting me on Ko-fi](https://ko-fi.com/steimerbyte)!

📟 **VSCode/Codium extension that auto-opens a terminal as an editor tab on the right and runs `pi` — no clicks required.**

## Features

- **Editor-tab terminal** — opens in a split group beside the active editor, not in the bottom panel
- **Auto-runs `pi`** — the moment Codium finishes starting, the terminal is up and `pi` is already running
- **Non-invasive** — uses `onStartupFinished` so it only fires once per session, never during debug
- **Pure VSCode API** — no shell wrappers, no extra dependencies

## Prerequisites

- VSCode **1.80+** or VSCodium
- `pi` on `PATH` (the [Pi coding agent](https://github.com/mariozechner/pi-coding-agent))

## Installation

### From VSIX

1. Download `pi-panel-0.0.1.vsix` from the [releases page](https://github.com/steimbyte/codium-pi-panel/releases)
2. In Codium: `Extensions` → `...` → **Install from VSIX** → select the file

```bash
codium --install-extension pi-panel-0.0.1.vsix
```

### From source

```bash
git clone https://github.com/steimbyte/codium-pi-panel.git
cd codium-pi-panel
npm install
npm run compile
npx vsce package
codium --install-extension pi-panel-0.0.1.vsix
```

## Usage

Nothing to configure. Just open Codium and reload once after install:

```
codium --reload
```

On startup, the extension:

1. Splits the editor — your code stays on the left, a new group appears on the right
2. Creates a terminal named **Pi Terminal** in that group
3. Runs `pi` automatically

**Layout:**

```
+----------------+----------------+
|                | [Pi Terminal] x|
|   Editor       |                |
|   (left)       |   pi>          |
|                |                |
+----------------+----------------+
```

## Configuration

None. The extension is intentionally zero-config. If `pi` isn't on your `PATH`, the terminal opens but the command fails silently — fix by installing Pi or adjusting your `PATH`.

## How it works

```typescript
// src/extension.ts
const terminal = vscode.window.createTerminal({
    name: 'Pi Terminal',
    location: { viewColumn: vscode.ViewColumn.Beside }  // -2 = new editor group to the right
});

terminal.show();
terminal.sendText('pi');
```

| Key | Value | Effect |
|-----|-------|--------|
| `activationEvents` | `onStartupFinished` | Fires once, on app start — not on every workspace |
| `viewColumn` | `ViewColumn.Beside` (`-2`) | Editor tab in a new split group, not the bottom panel |
| `hasActivated` guard | runtime | Prevents double-fire if activation re-triggers |

## Project Structure

```
codium-pi-panel/
├── src/
│   └── extension.ts    # ~20 lines — the whole extension
├── package.json        # manifest
├── tsconfig.json
├── .vscodeignore
├── .gitignore
├── AGENTS.md           # DOX project docs
└── README.md
```

## Build

```bash
npm run compile     # type-check + emit dist/extension.js
npx vsce package    # → pi-panel-0.0.1.vsix
```

## License

MIT
