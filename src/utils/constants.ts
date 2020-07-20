// Regular Expressions.
const COMPONENT_NAME_REGEX = '^[A-Z].*\.(jsx|tsx|js|ts)$';
const FILE_PATH_REGEX: string = '^[/\]';
const REACT_IMPORT_REGEX: RegExp = /import\s*\w*\s*from\s*["\']react["\']/;
const PROPTYPES_IMPORT_REGEX: RegExp = /import\s*\w*\s*from\s*["\']prop-types["\']/;

// Messages.
const READ_ERROR_MESSAGE: string = 'An error occurred while attempting to read the ';

export {
  COMPONENT_NAME_REGEX,
  FILE_PATH_REGEX,
  REACT_IMPORT_REGEX,
  PROPTYPES_IMPORT_REGEX,
  READ_ERROR_MESSAGE,
};

export default {
  COMPONENT_NAME_REGEX,
  FILE_PATH_REGEX,
  REACT_IMPORT_REGEX,
  PROPTYPES_IMPORT_REGEX,
  READ_ERROR_MESSAGE,
};