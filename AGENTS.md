# AGENTS.md — vscode-pi-panel

## Purpose

VSCode/Codium extension that auto-opens a terminal panel on the right side and runs `pi` command.

## Project Structure

```
vscode-pi-panel/
├── src/
│   └── extension.ts    # Main extension logic
├── package.json        # Extension manifest
├── tsconfig.json       # TypeScript config
└── README.md           # Documentation
```

## Key Implementation Details

### Terminal Location
- Uses `vscode.window.createTerminal()` with `location: { viewColumn: -1 }`
- `viewColumn: -1` positions terminal in right panel

### Panel Position
- Sets `workbench.panel.defaultLocation` to `right` via workspace config

### Activation
- Uses `*` activation event (activates on any workspace open)
- Auto-creates terminal and sends `pi` command

## TODO

- [ ] Test in Codium (VSCode-compatible)
- [ ] Add extensionDependencies if pi is an extension
- [ ] Consider activation event refinement
- [ ] Add vsix packaging
