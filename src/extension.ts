import * as vscode from 'vscode';

import { IComponentData, IOpenOptions, ISnippet } from './interfaces';
import { HELPERS } from './utils';

const {
	getDirectoryFilePaths, getFilesData, getSnippets,
	writeSnippetsFile,
} = HELPERS;

// This method is called when your extension is activated.
export function activate(context: vscode.ExtensionContext) {
	// The command has been defined in the package.json file.
	// The commandId parameter must match the command field in package.json.
	let disposable = vscode.commands.registerCommand('react-snippet-generator.generateComponentSnippets', () => {
		const openOptions: IOpenOptions = {
			canSelectFiles: false,
			canSelectFolders: true,
		};

		vscode.window.showOpenDialog(openOptions)
			.then((selectedFolderPaths: vscode.Uri[] | undefined) => {
				// No folder selected or empty array.
				if (!selectedFolderPaths || !selectedFolderPaths.length) { return; }

				// Get the file paths for all React components.
				const { path: selectedPath }: { path: string } = selectedFolderPaths[0];
				const filePaths: string[] = getDirectoryFilePaths(selectedPath);

				// Get the component data;
				const componentsData: Array<IComponentData> = getFilesData(filePaths);

				// Generate snippets.
				const emptySnippetsData: { [x: string]: ISnippet } = getSnippets(componentsData, 'empty');
				const requiredSnippetsData: { [x: string]: ISnippet } = getSnippets(componentsData, 'required');
				const propsSnippetsData: { [x: string]: ISnippet } = getSnippets(componentsData, 'props');
				const snippetsData = {
					...emptySnippetsData, ...requiredSnippetsData, ...propsSnippetsData,
				};

				// Write the component snippets to the .vscode folder.
				const { workspaceFolders = []} = vscode.workspace;
				writeSnippetsFile(snippetsData, workspaceFolders[0]);
			});
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
