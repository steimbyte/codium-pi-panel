[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/steimerbyte)

> ⭐ If you find this useful, consider [supporting me on Ko-fi](https://ko-fi.com/steimerbyte)!

<img src="https://storage.ko-fi.com/cdn/generated/fhfuc7slzawvi/2026-04-23_rest-162bec27f642a562eb8401eb0ceb3940-onjpojl8.jpg" width="250" alt="steimerbyte" style="border-radius: 5%; margin: 16px 0; max-width: 100%;"/>

# codium-pi-panel

**VSCode/Codium extension that auto-opens a terminal as an editor tab on the right and runs `pi` — no clicks required.**

![codium](https://img.shields.io/badge/codium-extension-blue)
![vscode](https://img.shields.io/badge/vscode-%5E1.80-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## Description

On startup, the extension splits the editor — your code stays on the left, a new editor group opens on the right. A terminal named **Pi Terminal** is created in that group and `pi` is started automatically. No configuration, no keybindings, no UI.

## Features

- **Editor-tab terminal** – Opens in a new editor group beside the active one, not in the bottom panel
- **Auto-runs `pi`** – Fires once on `onStartupFinished`, terminal is up and `pi` is already running
- **Non-invasive** – Only fires on app start, never during debug or window focus
- **Zero config** – No settings, no commands to remember, no panel to toggle
- **Pure VSCode API** – No shell wrappers, no extra runtime dependencies

## Installation

### From VSIX

Download `pi-panel-0.0.1.vsix` from the [releases page](https://github.com/steimbyte/codium-pi-panel/releases).

In VSCode/Codium: **Extensions** → `...` → **Install from VSIX** → select the file.

```bash
codium --install-extension pi-panel-0.0.1.vsix
```

### From Source

```bash
git clone https://github.com/steimbyte/codium-pi-panel.git
cd codium-pi-panel
npm install
npm run compile
npx vsce package
codium --install-extension pi-panel-0.0.1.vsix
```

## Usage

Nothing to configure. Open Codium and reload once after install:

```
codium --reload
```

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

None. The extension is intentionally zero-config. If `pi` isn't on your `PATH`, the terminal opens but the command fails silently — install Pi or fix your `PATH`.

## How It Works

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
| `activationEvents` | `onStartupFinished` | Fires once on app start — not on every workspace |
| `viewColumn` | `ViewColumn.Beside` (`-2`) | Editor tab in a new split group, not the bottom panel |
| `hasActivated` guard | runtime | Prevents double-fire if activation re-triggers |

## Requirements

- VSCode 1.80+ or VSCodium
- [`pi` coding agent](https://github.com/mariozechner/pi-coding-agent) on `PATH`

## Troubleshooting

| Problem | Fix |
|---------|-----|
| Terminal opens but `pi` command not found | Install [Pi](https://github.com/mariozechner/pi-coding-agent) or add it to `PATH` |
| Terminal opens in bottom panel, not as editor tab | Reinstall the extension — you may be on an old version |
| Terminal doesn't appear on startup | Check `onStartupFinished` events aren't blocked by other extensions |

## License

MIT

---

## Hinweis zur KI-Unterstützung

Bei der Entwicklung dieses Projekts wurden teilweise oder vollständig KI-gestützte Tools und Technologien eingesetzt.
