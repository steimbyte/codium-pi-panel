# AGENTS.md — src/

## Purpose

TypeScript source for the `codium-pi-panel` extension. Single entry point: `extension.ts`, compiled by `tsc` to `../dist/extension.js`.

## Ownership

- Compiled to: `../dist/extension.js` (entry in `package.json` `main`)
- Watch mode: `npm run watch` (`tsc -watch -p ./`)

## Local Contracts

- Module: CommonJS, target ES2020 (`tsconfig.json`)
- Imports: `import * as vscode from 'vscode'`
- Public exports: `activate(context: vscode.ExtensionContext)`, `deactivate()`
- Single source of truth for: terminal creation, command registration, Activity Bar provider, StatusBarItem

## Public Symbols

| Symbol | Kind | Purpose |
|--------|------|---------|
| `PiPanelProvider` | class | `TreeDataProvider` for `piPanel.view` — returns empty list; view has no items, click on π icon triggers `piPanel.open` via `onDidChangeVisibility` |
| `openPiTerminal()` | function | Creates terminal in right split with `cwd` = active editor's workspace folder, sends `pi` |
| `resolveCwd()` | function | Resolves cwd: active editor folder → first workspace folder → undefined |
| `MANAGED_SETTINGS` | const array | Single source of truth for settings the extension auto-configures (`{key, value, label}` per entry) |
| `ensureManagedSettings(context)` | async function | Runs on **every** activation. Iterates `MANAGED_SETTINGS`, writes only when `globalValue === undefined`. Shows one-time `InformationMessage` on first write (gated by `globalState.piPanel.settingsNotified`) |
| `hasActivated` | bool | Module-level guard, prevents double-fire |
| `statusBarItem` | StatusBarItem | Persists for the session, disposed in `deactivate()` |

## Work Guidance

- All `vscode.commands.registerCommand`, `createTreeView`, `createStatusBarItem` calls must push to `context.subscriptions` for proper disposal
- Do not call `openPiTerminal()` from `deactivate()` — terminal may already be torn down
- Keep the file under 200 lines — single-file extension by design
- When multi-root workspace is open, cwd follows the active editor's folder, not always `workspaceFolders[0]`
- `ensureManagedSettings` is fire-and-forget — never `await` it in `activate()` to keep activation fast
- Adding a new managed setting = appending to `MANAGED_SETTINGS` only; the function iterates and handles each entry

## Verification

- `npm run compile` → no TS errors
- All subscriptions registered before `activate()` returns
- `deactivate()` disposes the StatusBarItem
- Click π icon in Activity Bar → terminal opens **immediately**, no submenu, no double-click required
- On every activation, `ensureManagedSettings` runs; `settings.json` should always contain `terminal.integrated.confirmOnExit: false` and `terminal.integrated.confirmOnKill: "never"` after the first run
- If user has manually set different values, the extension does NOT overwrite them
- One-time notification appears on first install only, not on subsequent activations
- After uninstall + reinstall, the one-time notification can appear again (depends on whether `globalState` is cleared by VSCode on uninstall)
