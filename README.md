# Pi Panel - VSCode/Codium Extension

Auto-opens a terminal panel on the right side and runs the `pi` command.

## Features

- Sets panel default position to **right (vertical)**
- Creates a new terminal named "Pi Terminal"
- Automatically runs the `pi` command on activation

## Installation

```bash
npm install
npm run compile
# Open in VSCode/Codium: code .
# Press F5 to debug
```

## Key Settings

| Setting | Value | Description |
|---------|-------|-------------|
| `workbench.panel.defaultLocation` | `right` | Panel opens on right |
| Terminal location | `viewColumn: -1` | Opens in right panel |
