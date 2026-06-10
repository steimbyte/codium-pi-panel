import * as vscode from 'vscode';

let hasActivated = false;

export function activate(context: vscode.ExtensionContext) {
    if (hasActivated) return;
    hasActivated = true;

    // Create terminal as an editor tab — viewColumn: -2 (Beside) opens a new
    // editor group to the RIGHT of the current one, terminal appears as a tab there
    const terminal = vscode.window.createTerminal({
        name: 'Pi Terminal',
        location: {
            viewColumn: vscode.ViewColumn.Beside
        }
    });

    terminal.show();
    terminal.sendText('pi');
}

export function deactivate() {}
