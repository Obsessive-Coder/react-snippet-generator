export default interface IProps {
  [index: string]: {
    required: boolean,
    type: {
      name: string,
    },
  };
};