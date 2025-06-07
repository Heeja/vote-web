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
	title: string; // 투표 제목
	items: IVoteItems[]; // 투표 항목 및 투표 개수
	anonyOn: boolean; // 비공개(default: false) | 공개(true)
	createUser: string; // 투표 생성자
	createTime: Timestamp; // 투표 생성일시
	closeTime: Timestamp; // 투표 종료일시 (예정일시)
	state: boolean; // 투표 상태 |
	doubleOn: boolean; // 중복 투표 가능 여부
	secretBallot: boolean; // 개수 표시 여부
	completed: IVotedInfo[]; // 투표 완료자 목록
	location: string; // 투표 지역 Location
	limit: number; // 투표 제한인원
}
