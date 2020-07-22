export default interface IDirectoryItem {
  name: string;
  isDirectory: () => boolean;
};