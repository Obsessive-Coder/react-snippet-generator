import fs = require('fs');
import path = require('path');

const reactDocs = require('react-docgen');

// TODO: Put interfaces in external file.
// Interfaces.
interface IComponentData {
	description: string;
	displayName: string;
	methods: Array<any>;
	props: Object;
};

// Constants.
import {
  COMPONENT_NAME_REGEX,
  FILE_PATH_REGEX,
  REACT_IMPORT_REGEX,
  PROPTYPES_IMPORT_REGEX,
  READ_ERROR_MESSAGE,
} from './constants';

const HELPERS = {
  getDirectoryFilePaths: (directoryPath: string, allFilePaths: string[] = []): string[] => {
    /* NOTE: This method is a result of the following article:
      https://coderrocketfuel.com/article/recursively-list-all-the-files-in-a-directory-using-node-js
    */

    // Format the string for consistency.
    const formattedPath: string = HELPERS.formatFilePath(directoryPath);

    // Get and filter file and folder paths.
    const fileFolderNames: string[] = fs.readdirSync(formattedPath);
    const filteredNames: string[] = HELPERS.filterFileFolderNames(fileFolderNames);

    // Iterate each filtered file and folder path in the directory.
    for (let i: number = 0; i < filteredNames.length; i++) {
      // const filePath: string = path.join(formattedPath, filteredPaths[i]);
      const filePath: string = `${formattedPath}\\${filteredNames[i]}`;
      const isDirectory: boolean = fs.statSync(filePath).isDirectory();
      const isReactComponent = !isDirectory && HELPERS.isFileReactComponent(filePath);

      /**
       * If the file path is a directory...
       *  - Recursively call this function for all subdirectories.
       * Else if the file is a React component...
       *  - Add the file to the array of files.
      */
      if (isDirectory) {
        allFilePaths = HELPERS.getDirectoryFilePaths(filePath, allFilePaths);
      } else if (isReactComponent) {
        allFilePaths.push(filePath);
      }
    }

    return allFilePaths;
  },
  formatFilePath: (filePath: string): string => {
    const folderNames : string[] = filePath.split(RegExp(FILE_PATH_REGEX));
    return path.join(...folderNames);
  },
  filterFileFolderNames: (fileFolderPaths: string[]): string[] => {
    return fileFolderPaths.filter(p => (
      !p.toLowerCase().includes('test') && !p.includes('.d.')
    ));
  },
  isFileReactComponent: (filePath: string): boolean => {
    const splitPath: string[] = filePath.split('\\');
    const filename: string = splitPath[splitPath.length - 1];
    // Test filename against regex for react component name.
    return RegExp(COMPONENT_NAME_REGEX).test(filename);
  },
  getFilesData: (filePaths: string[]): Array<IComponentData> => {
    const reactFileContents: Array<IComponentData|undefined> = filePaths.map((filePath: string) => {
      const fileContent: string = fs.readFileSync(filePath, 'UTF-8');

      // Filter for content to ensure it is a React component.
      const isReactImported: boolean = REACT_IMPORT_REGEX.test(fileContent);
      const isPropTypesImported: boolean = PROPTYPES_IMPORT_REGEX.test(fileContent);

      let componentData: IComponentData|undefined;
      if (isReactImported && isPropTypesImported) {
        try {
          componentData = reactDocs.parse(fileContent);
        } catch (err) {
          console.log('ERROR: File is not a React component --- ', err);
        }
      }
      return componentData;
    });

    return <Array<IComponentData>> reactFileContents.filter(content => content);
  },
  getSnippets: (componentsData: Array<IComponentData>, snippetType: string): Array<string> => {
    return componentsData.map(({
      description, displayName, props,
    }: IComponentData) => {
      return JSON.stringify({
        [`${displayName}-${snippetType}`]: {
          description,
          prefix: `${displayName.charAt(0).toLocaleLowerCase()}${displayName.substring(1)}-${snippetType}`,
          body: `<${displayName}>$0</${displayName}>`
        }
      }, null, 2);
    });
  },
};

export default HELPERS;