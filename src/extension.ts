import * as vscode from 'vscode';

// Tree data provider for the activity bar entry — single clickable item
class PiPanelProvider implements vscode.TreeDataProvider<vscode.TreeItem> {
    getTreeItem(element: vscode.TreeItem): vscode.TreeItem {
        return element;
    }

    getChildren(): Thenable<vscode.TreeItem[]> {
        const item = new vscode.TreeItem('π  Open Pi Terminal');
        item.iconPath = new vscode.ThemeIcon('terminal');
        item.tooltip = 'Spawn a new Pi terminal in the right editor split';
        item.command = {
            command: 'piPanel.open',
            title: 'Open Pi Terminal',
        };
        return Promise.resolve([item]);
    }
}

let hasActivated = false;
let statusBarItem: vscode.StatusBarItem;

function openPiTerminal() {
    // Each click = a fresh terminal in the right split, running `pi`
    const terminal = vscode.window.createTerminal({
        name: 'Pi Terminal',
        location: { viewColumn: vscode.ViewColumn.Beside },
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

    // Activity bar view (icon on the left, where Extensions / Explorer live)
    const treeProvider = new PiPanelProvider();
    context.subscriptions.push(
        vscode.window.registerTreeDataProvider('piPanel.view', treeProvider)
    );

    // Status bar item (redundant access point — always visible, easy to click)
    statusBarItem = vscode.window.createStatusBarItem(
        vscode.StatusBarAlignment.Left,
        100
    );
    statusBarItem.text = 'π Pi';
    statusBarItem.tooltip = 'Spawn a new Pi terminal in the right split';
    statusBarItem.command = 'piPanel.open';
    statusBarItem.show();
    context.subscriptions.push(statusBarItem);
}

export function deactivate() {
    statusBarItem?.dispose();
}
