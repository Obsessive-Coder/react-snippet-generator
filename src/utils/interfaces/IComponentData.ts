import IProps from './IProps';

export default interface IComponentData {
	description: string;
	displayName: string;
	methods: Array<any>;
	props: IProps;
};