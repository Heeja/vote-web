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
	/* gap: 0.1rem; */
	/* border: 0.1rem solid #b1a85c; */
	padding: 0.5rem 2rem;
	width: 90vw;
`;

const VoteBox = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	gap: 0.5rem;
	width: 100%;
	text-align: center;

	div {
		margin: 0.2rem 0;
		border: 0.1rem solid #737373;
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

	div {
		border: 0.1rem solid #737373;
	}
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
			await VoteList({
				userUid: userUid,
				collectionName: "privateVote",
			}).then((res) => setVoteList((prev) => [...prev, ...res]));
			await VoteList({
				userUid: userUid,
				collectionName: "publicVote",
			}).then((res) => setVoteList((prev) => [...prev, ...res]));
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
					<TableItem $flex={2}>Duple</TableItem>
					<TableItem $flex={2}>limit</TableItem>
					<TableItem $flex={3}>location</TableItem>
					<TableItem $flex={3}>CreateDate</TableItem>
				</TableHeader>
				<hr style={{ width: "100%", borderColor: "#c1c1c1" }} />
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
							<TableItem $flex={2}>{list[key].doubleOn ? "Y" : "N"}</TableItem>
							<TableItem $flex={2}>{list[key].limit}</TableItem>
							<TableItem $flex={3}>{list[key].location ? "Y" : "-"}</TableItem>
							<TableItem $flex={3}>{date}</TableItem>
						</VoteBox>
					);
				})}
			</TableBox>
		</>
	);
}
