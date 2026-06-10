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
| `PiPanelProvider` | class | `TreeDataProvider` for `piPanel.view` — one clickable item |
| `openPiTerminal()` | function | Creates terminal in right split, sends `pi` |
| `hasActivated` | bool | Module-level guard, prevents double-fire |
| `statusBarItem` | StatusBarItem | Persists for the session, disposed in `deactivate()` |

## Work Guidance

- All `vscode.commands.registerCommand`, `registerTreeDataProvider`, `createStatusBarItem` calls must push to `context.subscriptions` for proper disposal
- Do not call `openPiTerminal()` from `deactivate()` — terminal may already be torn down
- Keep the file under 100 lines — single-file extension by design

## Verification

- `npm run compile` → no TS errors
- All subscriptions registered before `activate()` returns
- `deactivate()` disposes the StatusBarItem
