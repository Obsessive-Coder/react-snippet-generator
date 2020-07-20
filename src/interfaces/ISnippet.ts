export default interface ISnippet {
  [x: string]: {
    description: string,
    prefix: string,
    body: string|Array<string>
  };
};