import { Timestamp } from "firebase/firestore";

export interface IVoteItems {
	[key: string]: number | string;
	itemName: string;
	score: number;
}
export interface IVotedInfo {
	[key: string]: number | string | undefined;
	name: string;
	itemName: string;
	id?: string | undefined;
}
export interface IVoteData {
	anonyOn: boolean;
	createUser: string;
	createTime: Timestamp;
	closeTime: Timestamp;
	state: boolean;
	doubleOn: boolean;
	secretBallot: boolean;
	items: IVoteItems[];
	limit: number;
	location: string;
	title: string;
	completed?: IVotedInfo[];
	members?: string[];
}
