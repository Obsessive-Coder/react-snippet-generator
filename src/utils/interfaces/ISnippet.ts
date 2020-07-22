export default interface ISnippet {
  [index: string]: {
    description: string,
    prefix: string,
    body: string|Array<string>
  };
};