import * as vscode from 'vscode';

import {
	IComponentData, ISnippetFile, IPromiseData,
} from './utils/interfaces';
import { CONSTANTS, HELPERS } from './utils';

const {
	DEFAULT_OPEN_OPTIONS, DEFAULT_PROGRESS_REPORT,
	TOO_MANY_FILES_ERROR_MESSAGE, NO_COMPONENTS_ERROR_MESSAGE,
	CANCELLED_SNIPPET_GENERATION, PROGRESS_OPTIONS_DATA,
	SNIPPET_TYPES, DEFAULT_PICKER_OPTIONS,
} = CONSTANTS;

const {
	getComponentsData, getComponentFileNames, getSnippets,
	writeSnippetsFile,
} = HELPERS;

export function activate(context: vscode.ExtensionContext) {
	// Handler for generate snippets command.
	const disposable = vscode.commands.registerCommand(
		'react-snippet-generator.generateComponentSnippets', () => {
			/**
			 * This function handles the Generate Component Snippets command.
			 * After the user selects a folder where their component library
			 * is installed, this extension will attempt to find all files that
			 * are React components. Then react-docgen is used to parse information
			 * about the component. Finally, this data is converted to VS Code snippets
			 * format and saved to the user's snippet library.
			*/

			let componentLibraryName: string;
			let componentTotal: number = 0;
			let snippetTypes: string[] = [];

			// Show in input to capture the library name.
			vscode.window.showInputBox()
				.then((libraryName: string|undefined) => {
					if (!libraryName) { return; }

					componentLibraryName = libraryName;

					// Show a list of snippet types for the user to choose.
					return <Thenable<vscode.QuickPickItem[]|undefined>> vscode.window.showQuickPick(SNIPPET_TYPES, DEFAULT_PICKER_OPTIONS);
				})
				.then((selectedSnippetTypes: vscode.QuickPickItem[]|undefined = []) => {
					// Store the types of snippets to generate.
					snippetTypes = selectedSnippetTypes.map(
						({ label }: vscode.QuickPickItem) => label);

					// Show a dialog for the user to choose a component library.
					return vscode.window.showOpenDialog(DEFAULT_OPEN_OPTIONS);
				})
				.then((selectedFolderPaths: vscode.Uri[] | undefined) => {
					// Return if no folder is selected or it's an empty array.
					if (!selectedFolderPaths || !selectedFolderPaths.length) { return; }

					// Show progress status to the user.
					return vscode.window.withProgress(
						PROGRESS_OPTIONS_DATA, (progress, token) => {
							// Start the progress.
							progress.report(DEFAULT_PROGRESS_REPORT);

							return new Promise(async resolve => {
								// Get the file paths for all React components.
								const componentFilePaths: string[] = [];
								for (let i = 0; i < selectedFolderPaths.length; i++) {
									const { path: selectedPath }: vscode.Uri = selectedFolderPaths[i];
									componentFilePaths.push(
										...await getComponentFileNames(selectedPath));
								}

								// Stop if the user cancelled.
								if (token.isCancellationRequested) {
									return resolve({
										error: true,
										message: CANCELLED_SNIPPET_GENERATION,
									});
								}

								// Get the component data from the files.
								progress.report({
									...DEFAULT_PROGRESS_REPORT,
									message: 'Parsing Data',
								});
								const componentsData: Array<IComponentData> = await
									getComponentsData(componentFilePaths, () => {
										// Handles the bug where too many files are open.
										// TODO: Fix the "too many files" bug in getComponentsData.
										resolve({
											error: true,
											message: TOO_MANY_FILES_ERROR_MESSAGE,
										});
									});

								// Stop if the user cancelled.
								if (token.isCancellationRequested) {
									return resolve({
										error: true,
										message: CANCELLED_SNIPPET_GENERATION,
									});
								}

								// Store the number of components to be displayed later.
								componentTotal = componentsData.length;

								// Return if there are no components.
								if (componentTotal <= 0) {
									return resolve({
										error: true,
										message: NO_COMPONENTS_ERROR_MESSAGE,
									});
								}

								// Generate snippets.
								progress.report({
									...DEFAULT_PROGRESS_REPORT,
									message: 'Creating Snippets',
								});

								const snippetsData: ISnippetFile = snippetTypes.reduce((acc, current) => ({
									...acc,
									...getSnippets(componentsData, current.toLowerCase())
								}), {});

								// Stop if the user cancelled.
								if (token.isCancellationRequested) {
									return resolve({
										error: true,
										message: CANCELLED_SNIPPET_GENERATION,
									});
								}

								// Write the component snippets to the .vscode folder.
								progress.report({
									...DEFAULT_PROGRESS_REPORT,
									message: 'Writing Snippets File',
								});
								const { workspaceFolders = [] } = vscode.workspace;
								const snippetsFileData: IPromiseData = await writeSnippetsFile(
									snippetsData, workspaceFolders[0].uri.fsPath, componentLibraryName);

								resolve(snippetsFileData);
							});
						}
					);
				})
				.then((result: any) => {
					// Show an error or info message based on the result.
					const { error = false, message } = result;
					const { showInformationMessage, showErrorMessage} = vscode.window;
					const showMessage = error ? showErrorMessage : showInformationMessage;
					showMessage(error ? message : `${message} ${componentTotal} components.`);
				});
		});

	context.subscriptions.push(disposable);
};

export function deactivate() { };
