[![ko-fi](https://ko-fi.com/img/githubbutton_sm.png)](https://ko-fi.com/steimerbyte)

> ⭐ Wenn du das nützlich findest, [unterstütze mich auf Ko-fi](https://ko-fi.com/steimerbyte)!

<img src="https://storage.ko-fi.com/cdn/generated/fhfuc7slzawvi/2026-04-23_rest-162bec27f642a562eb8401eb0ceb3940-onjpojl8.jpg" width="250" alt="steimerbyte" style="border-radius: 5%; margin: 16px 0; max-width: 100%;"/>

# codium-pi-panel

**VSCode/Codium-Erweiterung, die automatisch ein Terminal als Editor-Tab rechts öffnet und `pi` startet – keine Klicks nötig.**

![codium](https://img.shields.io/badge/codium-extension-blue)
![vscode](https://img.shields.io/badge/vscode-%5E1.80-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## Beschreibung

Beim Start splittet die Erweiterung den Editor – dein Code bleibt links, eine neue Editor-Gruppe öffnet sich rechts. Ein Terminal namens **Pi Terminal** wird in dieser Gruppe erstellt und `pi` automatisch gestartet. Keine Konfiguration, keine Tastenkürzel, keine UI.

## Features

- **π-Button in der Activity Bar** – Neues Icon links (neben Explorer & Extensions) – ein Klick spawnt ein frisches Pi-Terminal im rechten Split
- **Statusbar-Item** – Zusätzlicher π-Button unten links, immer sichtbar
- **Editor-Tab-Terminal** – Öffnet in einer neuen Editor-Gruppe neben der aktiven, nicht im unteren Panel
- **Startet `pi` automatisch** – Feuert einmal bei `onStartupFinished`, Terminal ist offen und `pi` läuft bereits
- **Nicht-invasiv** – Nur beim App-Start, nie während Debug oder Window-Focus
- **Null Konfiguration** – Keine Einstellungen, keine Commands zum Merken, kein Panel zum Umschalten
- **Reine VSCode-API** – Keine Shell-Wrapper, keine zusätzlichen Runtime-Abhängigkeiten

## Installation

### Aus VSIX

Lade `pi-panel-0.0.1.vsix` von der [Releases-Seite](https://github.com/steimbyte/codium-pi-panel/releases) herunter.

In VSCode/Codium: **Extensions** → `...` → **Install from VSIX** → Datei auswählen.

```bash
codium --install-extension pi-panel-0.0.1.vsix
```

### Aus dem Quellcode

```bash
git clone https://github.com/steimbyte/codium-pi-panel.git
cd codium-pi-panel
npm install
npm run compile
npx vsce package
codium --install-extension pi-panel-0.0.1.vsix
```

## Verwendung

Nichts zu konfigurieren. Codium öffnen und nach der Installation einmal neu laden:

```
codium --reload
```

**Layout:**

```
+----------------+----------------+
|                | [Pi Terminal] x|
|   Editor       |                |
|   (links)      |   pi>          |
|                |                |
+----------------+----------------+
```

## Konfiguration

Keine. Die Erweiterung ist absichtlich konfigurationsfrei. Wenn `pi` nicht im `PATH` ist, öffnet sich das Terminal, aber der Befehl schlägt still fehl – installiere Pi oder korrigiere deinen `PATH`.

## Funktionsweise

```typescript
// src/extension.ts
const terminal = vscode.window.createTerminal({
    name: 'Pi Terminal',
    location: { viewColumn: vscode.ViewColumn.Beside }  // -2 = neue Editor-Gruppe rechts
});

terminal.show();
terminal.sendText('pi');
```

| Schlüssel | Wert | Effekt |
|-----------|------|--------|
| `activationEvents` | `onStartupFinished` | Feuert einmal beim App-Start – nicht bei jedem Workspace |
| `viewColumn` | `ViewColumn.Beside` (`-2`) | Editor-Tab in neuer Split-Gruppe, nicht im unteren Panel |
| `hasActivated` Guard | Laufzeit | Verhindert Doppelauslösung bei Re-Aktivierung |

## Anforderungen

- VSCode 1.80+ oder VSCodium
- [`pi` Coding Agent](https://github.com/mariozechner/pi-coding-agent) im `PATH`

## Fehlerbehebung

| Problem | Lösung |
|---------|--------|
| Terminal öffnet, aber `pi`-Befehl nicht gefunden | [Pi](https://github.com/mariozechner/pi-coding-agent) installieren oder zum `PATH` hinzufügen |
| Terminal öffnet im unteren Panel, nicht als Editor-Tab | Erweiterung neu installieren – möglicherweise alte Version |
| Terminal erscheint nicht beim Start | Prüfen, ob `onStartupFinished` von anderen Erweiterungen blockiert wird |

## Lizenz

MIT

---

## Hinweis zur KI-Unterstützung

Bei der Entwicklung dieses Projekts wurden teilweise oder vollständig KI-gestützte Tools und Technologien eingesetzt.
