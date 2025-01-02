import { Timestamp } from "firebase/firestore";

export interface IVoteItems {
	[key: string]: number | string;
	itemName: string;
	score: number;
}
export interface IVoteData {
	anonyOn: boolean;
	createTime: Timestamp;
	createUser: string;
	doubleOn: boolean;
	secretBallot: boolean;
	items: IVoteItems[];
	limit: number;
	location: string;
	title: string;
	completed: string[];
	members: string[];
}
