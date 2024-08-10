import React, { useEffect, useState } from "react";
import {
	collection,
	DocumentData,
	getDocs,
	orderBy,
	query,
	where,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import { database } from "../routes/firebase";

import firebaseSessionStorage from "../util/firebaseSessionStorage";
import TransformDateString from "../util/transformDateString";

// styld Componnets

const TableBox = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	align-items: center;
	gap: 0.5rem;
	padding: 1rem 0.2rem;
	width: 90vw;

	hr {
		margin: 0.2rem 0;
	}
`;

const VoteBox = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;

	width: 100%;
	text-align: center;
	font-size: 0.8rem;
	border: 0.1rem solid #e0c0c0;
	border-radius: 0.4rem;

	div {
		margin: 0.2rem 0;
	}
	div:last-child {
		font-size: 0.7rem;
	}
`;

const TableHeader = styled.div`
	display: flex;
	/* justify-content: space-between; */
	align-items: center;
	flex: 1;
	gap: 0.5rem;
	width: 100%;
	text-align: center;
	font-size: 0.8rem;
`;

const TableItem = styled.div<{ $flex: number }>`
	flex: ${(props) => props.$flex};
	width: "100%";
	padding: "0.2rem";
	overflow: "clip";
`;

// type interface
interface IVotelist {
	[key: string]: DocumentData;
}
[];
// firestore api
async function VoteList({
	userUid,
	collectionName,
}: {
	userUid: unknown;
	collectionName: string;
}) {
	const data: IVotelist[] = [];
	const listQuery = query(
		collection(database, collectionName),
		where("createUser", "==", userUid),
		orderBy("createTime", "desc")
	);
	const response = await getDocs(listQuery);
	response.forEach((doc) => data.push({ [doc.id]: doc.data() }));

	return data;
}

// main
export default function Votelist() {
	const navigate = useNavigate();
	const [voteList, setVoteList] = useState<IVotelist[]>([]);
	const userUid = firebaseSessionStorage().uid;

	// fucntions
	const onClickNavigate = (e: React.MouseEvent<HTMLDivElement>) => {
		const { id, dataset } = e.currentTarget;

		if (dataset.idx) {
			voteList &&
				navigate(id, {
					state: { voteInfo: voteList[parseInt(dataset.idx)][id] },
				});
		}
		return;
	};

	useEffect(() => {
		async function responseData() {
			setVoteList([]); // VoteList가 전체를 불러오기 때문에 기존 list는 초기화 후 다시 할당한다.
			await VoteList({
				userUid: userUid,
				collectionName: "privateVote",
			}).then((res) => {
				// todo: 중복값을 제거하고 넣는 것이 좋은지... 체크 후 수정
				// const resKeyList = res.filter((item) => {
				// 	const key = Object.keys(item)[0];
				// 	if (keyList.find((listKey) => listKey === key)) {
				// 		return false;
				// 	} else {
				// 		return true;
				// 	}
				// });
				// console.log("filter:", resKeyList);

				setVoteList((prev) => [...prev, ...res]);
			});
			await VoteList({
				userUid: userUid,
				collectionName: "publicVote",
			}).then((res) => {
				// const resKeyList = res.filter((item) => {
				// 	const key = Object.keys(item)[0];
				// 	if (keyList.find((listKey) => listKey === key)) {
				// 		return false;
				// 	} else {
				// 		return true;
				// 	}
				// });
				setVoteList((prev) => [...prev, ...res]);
			});
		}

		return () => {
			responseData();
		};
	}, []);

	return (
		<>
			<h1>투표 관리</h1>
			<TableBox>
				<TableHeader>
					<TableItem $flex={1}>No.</TableItem>
					<TableItem $flex={5}>Title</TableItem>
					<TableItem $flex={2}>Anonym</TableItem>
					{/* <TableItem $flex={2}>Duple</TableItem>
					<TableItem $flex={2}>limit</TableItem>
					<TableItem $flex={3}>location</TableItem> */}
					<TableItem $flex={3}>CreateDate</TableItem>
				</TableHeader>
				<hr />
				{voteList?.map((list, idx) => {
					const key = Object.keys(list)[0];
					const fireBaseTime = new Date(
						list[key].createTime.seconds * 1000 +
							list[key].createTime.nanoseconds / 1000000
					);
					const date = TransformDateString(fireBaseTime);
					return (
						<VoteBox
							key={idx}
							onClick={onClickNavigate}
							id={key}
							data-idx={idx.toString()}>
							<TableItem $flex={1}>{idx + 1}</TableItem>
							<TableItem $flex={5}>{list[key].title}</TableItem>
							<TableItem $flex={2}>{list[key].anonyOn ? "Y" : "N"}</TableItem>
							{/* <TableItem $flex={2}>{list[key].doubleOn ? "Y" : "N"}</TableItem>
							<TableItem $flex={2}>{list[key].limit}</TableItem>
							<TableItem $flex={3}>{list[key].location ? "Y" : "-"}</TableItem> */}
							<TableItem $flex={3}>{date}</TableItem>
						</VoteBox>
					);
				})}
			</TableBox>
		</>
	);
}
