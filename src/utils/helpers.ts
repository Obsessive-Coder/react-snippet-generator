import path = require('path');
import {
  IComponentData, IDirectoryItem, IPromiseData,
  ISnippetFile,
} from './interfaces';

const { promises: fs } = require('fs');
const mkdirp = require('mkdirp');
const reactDocs = require('react-docgen');

// Constants.
import {
  COMPONENT_NAME_REGEX,
  FILE_PATH_REGEX,
  REACT_IMPORT_REGEX,
  PROPTYPES_IMPORT_REGEX,
  GENERATE_SUCCESS_MESSAGE,
  GENERATE_ERROR_MESSAGE,
} from './constants';

const HELPERS = {
  getComponentFileNames: async (directoryPath: string) => {
    /**
     * This method recursively reads a directory and subdirectory,
     * and returns and array of file paths that might be React components.
     *
     * NOTE: It is a result of the following article:
     * https://dev.to/leonard/get-files-recursive-with-the-node-js-file-system-fs-2n7o
    */

    // Format the directory path for consistency.
    const formattedPath: string = formatFilePath(directoryPath);

    // Read the directory.
    const directoryItems: Array<IDirectoryItem> = await
      fs.readdir(formattedPath, { withFileTypes: true });

    // Separate directories and files.
    const directories: Array<IDirectoryItem> = directoryItems.filter(
      (item: IDirectoryItem): boolean => item.isDirectory());

    const files: Array<string> = directoryItems.filter(
      (item: IDirectoryItem): boolean => (
        !item.isDirectory() && isFilenameComponent(item.name))
      ).map(({ name }: IDirectoryItem): string => `${formattedPath}/${name}`);

    // Recursively call this function and add the files to the files array.
    for (let directory of directories) {
      files.push(...await HELPERS.getComponentFileNames(
        `${directoryPath}/${directory.name}`));
    }

    return files;
  },
  getComponentsData: async (componentPaths: string[], handleTooManyFilesError: () => void): Promise<Array<IComponentData>> => {
    /**
     * Try to get the components' data using react-docgen.
     * Undefined values indicate the file is not a React
     * component, or react-docgen threw an error. The undefined
     * items are filtered out before returning the final array.
    */

    // Build an array of file contents, or undefined.
    const componentFileContents: Array<IComponentData|undefined> = await Promise.all(
      (componentPaths.map(async (
        filePath: string): Promise<IComponentData|undefined> => {
          // Read the contents of the file.
          const fileContent: string = await
            fs.readFile(filePath, 'UTF-8')
              .catch(handleTooManyFilesError);

          // Try to get the component data.
          let componentData: IComponentData|undefined;
          try {
            componentData = reactDocs.parse(fileContent);
          } finally { return componentData; }
        }
      )
    ));

    // Return the items that have component data (React components).
    return <Array<IComponentData>> componentFileContents.filter(
      (content: IComponentData|undefined) => (
        content?.displayName && content?.props
      )
    );
  },
  getSnippets: (
    componentsData: Array<IComponentData>, snippetType: string
  ): ISnippetFile => {
    /**
     * This method takes the data produced by react-docgen, and
     * converts it into VS Code snippets format.
    */
    return componentsData.reduce(
      (acc, { displayName, description, props = {} }: IComponentData) => {
        // Get a list of props for this component based on the type of snippet.
        const propNames: Array<string> = snippetType === 'empty' ? [] : (
          Object.keys(props).filter((name: string): boolean => (
            snippetType === 'required' ? props[name].required : true
          ))
        );

        // The snippet name is the component name with the snippet type appended.
        const snippetSuffix: string = propNames.length ? snippetType : 'empty';
        const snippetName: string = `${displayName}-${snippetSuffix}`;

        return ({
          ...acc,
          [snippetName]: {
            description,
            prefix: `${snippetName.charAt(0).toLowerCase()}${snippetName.substring(1)}`,
            body: ((): string|string[] => {
              // If snippet type is empty or there are no props.
              if (!propNames.length || !props) {
                return `<${displayName}>$0</${displayName}>`;
              }

              // The opening tag for the component.
              let bodyLines: string[] = [
                `<${displayName}`
              ];

              // Add each prop and type to the snippet.
              bodyLines = bodyLines.concat(propNames.map((name: string, index): string => (
                `\t${name}="${'${' + (index + 1) + ':[' + props[name]?.type?.name + '' + ']}'}"`
              )));

              // Close the opening tag and add the closing tag to the snippet.
              bodyLines.push(`>`, '\t${0:[data]}', `</${displayName}>`);

              return bodyLines;
            })(),
          }
        });
      }, {});
  },
  writeSnippetsFile: async (
    snippetsData: ISnippetFile, projectPath: string, libraryName: string
  ): Promise<IPromiseData> => {
    // TODO: Return a promise from here so a message can be shown to the user.
    // Writes a VS Code snippets file to the user's project directory.
    return new Promise(async resolve => {
      // Save path: "project-directory/.vscode/filename.code-snippets".
      const snippetsPath: string = path.join(projectPath, '.vscode');
      const fullPath: string = path.join(snippetsPath, `${libraryName}.code-snippets`);

      // Format and convert the data to a JSON string.
      const snippetsJSON: string = JSON.stringify(snippetsData, null, 2);

      // Create the folder if it does not exist and write the file.
      await mkdirp(snippetsPath);
      const writeResult: any = await fs.writeFile(fullPath, snippetsJSON);

      resolve({
        message: writeResult ? GENERATE_ERROR_MESSAGE : GENERATE_SUCCESS_MESSAGE,
        error: writeResult || false,
      });
    });
  },
};

function formatFilePath(filePath: string): string {
  // Formats the file path to match a specific pattern.
  const folderNames: string[] = filePath.split(FILE_PATH_REGEX);
  return path.join(...folderNames);
}

function isFilenameComponent(filePath: string): boolean {
  // Determines if the name of a file matches React naming conventions.
  const splitPath: string[] = filePath.split('\\');
  const filename: string = splitPath[splitPath.length - 1];
  return COMPONENT_NAME_REGEX.test(filename);
}

function isFileContentComponent(fileContent: string): boolean {
  // TODO: Apply more accurate regex patterns.
  // TODO: Consider removing since invalid files are ignored.
  // Determines if a file is a React component.
  const isReactImported: boolean = REACT_IMPORT_REGEX.test(fileContent);
  const isPropTypesImported: boolean = PROPTYPES_IMPORT_REGEX.test(fileContent);

  return isReactImported && isPropTypesImported;
}

export default HELPERS;