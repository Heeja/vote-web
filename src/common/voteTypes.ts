import { Timestamp } from "firebase/firestore";

export interface IVoteItems {
	[key: string]: number | string;
	itemName: string;
	score: number;
}
export interface IVotedInfo {
	[key: string]: number | string | Timestamp | undefined;
	name: string;
	itemName: string;
	id?: string | undefined;
	voteDate: Timestamp;
}
export interface IVoteData {
	anonyOn: boolean; // 비공개(default: false) | 공개(true)
	createUser: string; // 투표 생성자
	createTime: Timestamp; // 투표 생성일시
	closeTime: Timestamp; // 투표 종료일시 (예정일시)
	state: boolean; // 투표 상태 |
	doubleOn: boolean;
	secretBallot: boolean;
	items: IVoteItems[];
	limit: number;
	location: string;
	title: string;
	completed?: IVotedInfo[];
}
