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

// Resolve the cwd for the new terminal:
// 1. Workspace folder of the active editor (most specific)
// 2. First workspace folder (fallback)
// 3. undefined → VSCode uses its default (user home)
function resolveCwd(): vscode.Uri | undefined {
    const activeUri = vscode.window.activeTextEditor?.document.uri;
    if (activeUri) {
        const folder = vscode.workspace.getWorkspaceFolder(activeUri);
        if (folder) return folder.uri;
    }
    const folders = vscode.workspace.workspaceFolders;
    if (folders && folders.length > 0) return folders[0].uri;
    return undefined;
}

function openPiTerminal() {
    const terminal = vscode.window.createTerminal({
        name: 'Pi Terminal',
        location: { viewColumn: vscode.ViewColumn.Beside },
        cwd: resolveCwd(),
    });
    terminal.show();
    terminal.sendText('pi');
}

export function activate(context: vscode.ExtensionContext) {
    // First-time auto-open on app start
    if (!hasActivated) {
        hasActivated = true;
        openPiTerminal();
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
