import {
  OpenDialogOptions, ProgressLocation, ProgressOptions,
  QuickPickOptions, QuickPickItem
} from 'vscode';
import { IProgressReport } from './interfaces';

// Regular Expressions.
const COMPONENT_NAME_REGEX: RegExp = /^[A-Z].*\.(jsx|tsx|js|ts)$/;
const FILE_PATH_REGEX: RegExp = /[/\\]/;

// Messages.
const GENERAL_ERROR_MESSAGE: string = 'ERROR: An error occurred while attempting to';
const GENERATE_SUCCESS_MESSAGE: string = 'Successfully generated snippets for';
const GENERATE_ERROR_MESSAGE: string = `${GENERAL_ERROR_MESSAGE} generate the snippets file.`;
const TOO_MANY_FILES_ERROR_MESSAGE: string = 'Too many files. Please select another directory.';
const NO_COMPONENTS_ERROR_MESSAGE: string = 'React Snippet Generator: No components found.';
const CANCELLED_SNIPPET_GENERATION: string = 'The snippet generator was cancelled.';

// Collections.
const SNIPPET_TYPES: Array<QuickPickItem> = [{
  label: 'Empty',
  description: 'Generate empty snippets only.',
  picked: true,
}, {
  label: 'Required',
  description: 'Generate snippets with required props.',
  picked: true,
}, {
  label: 'Props',
  description: 'Generate snippets with all props.',
  picked: true,
}];

const DEFAULT_OPEN_OPTIONS: OpenDialogOptions = {
  canSelectFiles: false,
  canSelectFolders: true,
  canSelectMany: true,
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
const DEFAULT_PICKER_OPTIONS: QuickPickOptions = {
  canPickMany: true,
  ignoreFocusOut: true,
};

export {
  COMPONENT_NAME_REGEX,
  FILE_PATH_REGEX,
  GENERATE_SUCCESS_MESSAGE,
  GENERATE_ERROR_MESSAGE,
  TOO_MANY_FILES_ERROR_MESSAGE,
  NO_COMPONENTS_ERROR_MESSAGE,
  CANCELLED_SNIPPET_GENERATION,
  SNIPPET_TYPES,
  DEFAULT_OPEN_OPTIONS,
  PROGRESS_OPTIONS_DATA,
  DEFAULT_PROGRESS_REPORT,
  DEFAULT_PICKER_OPTIONS,
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
  CANCELLED_SNIPPET_GENERATION,
  SNIPPET_TYPES,
  DEFAULT_OPEN_OPTIONS,
  PROGRESS_OPTIONS_DATA,
  DEFAULT_PROGRESS_REPORT,
  DEFAULT_PICKER_OPTIONS,
};