import { OpenDialogOptions, ProgressLocation, ProgressOptions } from 'vscode';
import { IProgressReport } from './interfaces';

// Regular Expressions.
const COMPONENT_NAME_REGEX: RegExp = /^[A-Z].*\.(jsx|tsx|js|ts)$/;
const FILE_PATH_REGEX: RegExp = /[/\\]/;
const REACT_IMPORT_REGEX: RegExp = /import\s*\w*\s*from\s*["\']react["\']/;
const PROPTYPES_IMPORT_REGEX: RegExp = /import\s*\w*\s*from\s*["\']prop-types["\']/;

// Messages.
const GENERAL_ERROR_MESSAGE: string = 'ERROR: An error occurred while attempting to';
const GENERATE_SUCCESS_MESSAGE: string = 'Successfully generated snippets for';
const GENERATE_ERROR_MESSAGE: string = `${GENERAL_ERROR_MESSAGE} generate the snippets file.`;
const TOO_MANY_FILES_ERROR_MESSAGE: string = 'Too many files. Please select another directory.';
const NO_COMPONENTS_ERROR_MESSAGE: string = 'React Snippet Generator: No components found.';

// Collections.
const SNIPPET_TYPES: Array<string> = ['empty', 'required', 'props'];
const DEFAULT_OPEN_OPTIONS: OpenDialogOptions = {
  canSelectFiles: false,
  canSelectFolders: true,
  canSelectMany: false,
};
const PROGRESS_OPTIONS_DATA: ProgressOptions = {
  location: ProgressLocation.Notification,
  title: 'Generate Snippets',
  cancellable: true
};
const DEFAULT_PROGRESS_REPORT: IProgressReport = {
  increment: 25,
  message: 'Getting Files',
};

export {
  COMPONENT_NAME_REGEX,
  FILE_PATH_REGEX,
  REACT_IMPORT_REGEX,
  PROPTYPES_IMPORT_REGEX,
  GENERATE_SUCCESS_MESSAGE,
  GENERATE_ERROR_MESSAGE,
  TOO_MANY_FILES_ERROR_MESSAGE,
  NO_COMPONENTS_ERROR_MESSAGE,
  SNIPPET_TYPES,
  DEFAULT_OPEN_OPTIONS,
  PROGRESS_OPTIONS_DATA,
  DEFAULT_PROGRESS_REPORT,
};

export default {
  COMPONENT_NAME_REGEX,
  FILE_PATH_REGEX,
  REACT_IMPORT_REGEX,
  PROPTYPES_IMPORT_REGEX,
  GENERATE_SUCCESS_MESSAGE,
  GENERATE_ERROR_MESSAGE,
  TOO_MANY_FILES_ERROR_MESSAGE,
  NO_COMPONENTS_ERROR_MESSAGE,
  SNIPPET_TYPES,
  DEFAULT_OPEN_OPTIONS,
  PROGRESS_OPTIONS_DATA,
  DEFAULT_PROGRESS_REPORT,
};