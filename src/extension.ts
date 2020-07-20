import * as vscode from 'vscode';

import { HELPERS } from './utils';

const {
	getDirectoryFilePaths, getFilesData, getSnippets,
} = HELPERS;

// TODO: Put interfaces in external file.
// Interfaces.
interface IOpenOptions {
	canSelectFiles: boolean;
	canSelectFolders: boolean;
};

interface IComponentData {
	description: string;
	displayName: string;
	methods: Array<any>;
	props: Object;
};

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

				// Generate empty snippets.
				const emptySnippets: Array<string> = getSnippets(componentsData, 'empty');

				console.log(...emptySnippets);
			});
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
