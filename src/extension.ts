import * as vscode from 'vscode';

// Empty tree — view exists to host the π icon in the Activity Bar
class PiPanelProvider implements vscode.TreeDataProvider<vscode.TreeItem> {
    getTreeItem(element: vscode.TreeItem): vscode.TreeItem {
        return element;
    }
    getChildren(): Thenable<vscode.TreeItem[]> {
        return Promise.resolve([]);
    }
}

let hasActivated = false;
let statusBarItem: vscode.StatusBarItem;

// Resolve the cwd for the new terminal.
// The window root is the first entry in workspaceFolders —
// this is the folder VSCode was opened with (e.g. `code /path/to/folder`)
// and is the most reliable indicator of the "current workspace root".
// activeTextEditor is intentionally NOT consulted: in multi-root
// workspaces it may point to a file from a *different* root folder.
function resolveCwd(): vscode.Uri | undefined {
    const folders = vscode.workspace.workspaceFolders;
    if (folders && folders.length > 0) return folders[0].uri;

    // Last-resort fallback: an open single file outside any workspace.
    const activeUri = vscode.window.activeTextEditor?.document.uri;
    if (activeUri) {
        return vscode.workspace.getWorkspaceFolder(activeUri)?.uri;
    }
    return undefined;
}

function openPiTerminal() {
    const cwd = resolveCwd();
    const options: vscode.TerminalOptions = {
        name: 'Pi Terminal',
        location: { viewColumn: vscode.ViewColumn.Beside },
    };
    if (cwd) {
        options.cwd = cwd;
    }
    const terminal = vscode.window.createTerminal(options);
    terminal.show();
    terminal.sendText('pi');
}

// Settings the extension manages — single source of truth.
const MANAGED_SETTINGS: Array<{
    key: string;
    value: unknown;
    label: string;
}> = [
    { key: 'confirmOnExit', value: false, label: 'terminal.integrated.confirmOnExit → false' },
    { key: 'confirmOnKill', value: 'never', label: 'terminal.integrated.confirmOnKill → "never"' },
];

/**
 * Runs on every extension activation.
 * For each managed setting:
 *   1. Read the current user-level (global) value
 *   2. If it is undefined (user has not set it), write our desired value to user settings
 *   3. If it is already set, leave it alone (user override wins)
 * Idempotent — safe to call on every activation.
 */
async function ensureManagedSettings(context: vscode.ExtensionContext): Promise<void> {
    const config = vscode.workspace.getConfiguration('terminal.integrated');
    const changes: string[] = [];

    for (const setting of MANAGED_SETTINGS) {
        const inspected = config.inspect(setting.key);
        if (inspected?.globalValue === undefined) {
            await config.update(setting.key, setting.value, vscode.ConfigurationTarget.Global);
            changes.push(setting.label);
        }
    }

    // One-time notification: tell the user the first time we wrote any setting
    if (changes.length > 0 && !context.globalState.get<boolean>('piPanel.settingsNotified')) {
        await context.globalState.update('piPanel.settingsNotified', true);
        vscode.window.showInformationMessage(
            `π Pi Panel auto-configured ${changes.length} setting(s):\n${changes.join('\n')}`
        );
    }
}

export function activate(context: vscode.ExtensionContext) {
    // Run managed-settings check on every activation (fire-and-forget; idempotent)
    ensureManagedSettings(context).catch((err) =>
        console.error('[piPanel] failed to ensure managed settings:', err)
    );

    // First-time auto-open on app start — guard against
    // workspaceFolders not being populated yet at onStartupFinished.
    // The 500 ms buffer gives the window time to resolve its workspace roots.
    if (!hasActivated) {
        hasActivated = true;
        setTimeout(() => {
            const cwd = resolveCwd();
            const options: vscode.TerminalOptions = {
                name: 'Pi Terminal',
                location: { viewColumn: vscode.ViewColumn.Beside },
            };
            if (cwd) {
                options.cwd = cwd;
            }
            const terminal = vscode.window.createTerminal(options);
            terminal.show();
            terminal.sendText('pi');
        }, 500);
    }

    // Command: spawn new pi terminal
    const openCommand = vscode.commands.registerCommand('piPanel.open', openPiTerminal);
    context.subscriptions.push(openCommand);

    // Activity Bar π icon — click → openPiTerminal() directly (no submenu)
    const treeView = vscode.window.createTreeView('piPanel.view', {
        treeDataProvider: new PiPanelProvider(),
    });
    context.subscriptions.push(
        treeView.onDidChangeVisibility((e) => {
            if (e.visible) {
                openPiTerminal();
            }
        })
    );
    context.subscriptions.push(treeView);

    // Status bar item
    statusBarItem = vscode.window.createStatusBarItem(
        vscode.StatusBarAlignment.Left,
        100
    );
    statusBarItem.text = 'π Pi';
    statusBarItem.tooltip = 'Spawn a new Pi terminal in the right split (current project folder)';
    statusBarItem.command = 'piPanel.open';
    statusBarItem.show();
    context.subscriptions.push(statusBarItem);
}

export function deactivate() {
    statusBarItem?.dispose();
}
