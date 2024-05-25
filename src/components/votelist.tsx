import React, { useEffect, useState } from "react";
import {
	collection,
	DocumentData,
	getDocs,
	query,
	where,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import { database } from "../routes/firebase";

import firebaseSessionStorage from "../util/firebaseSessionStorage";

// styld Componnets

const TableBox = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	align-items: center;
	gap: 0.1rem;
	border: 0.1rem solid #b1a85c;
	padding: 0.5rem 2rem;
	width: 90vw;
`;

const VoteBox = styled.div`
	/* display: grid;
	grid-template-columns: repeat(7, 1fr);
	grid-template-rows: 1fr;
	grid-column-gap: 1rem;
	grid-row-gap: 0.2rem; */
	display: flex;
	gap: 0.5rem;
	padding: 0.2rem 1rem;
	width: 100%;
	text-align: center;

	div {
		border: 0.1rem solid #ffffff;
		padding: 0.2rem 0.5rem;
	}
`;

const TableHeader = styled.div`
	display: flex;
	flex: 1;
	gap: 0.5rem;
	padding: 0.2rem 1rem;
	width: 100%;
	text-align: center;

	div {
		border: 0.1rem solid #ffffff;
		padding: 0.2rem 0.5rem;
	}
`;

// firestore api

async function MyVoteList() {
	const data: DocumentData[] = [];
	const userUid = firebaseSessionStorage().uid;
	const listQuery = query(
		collection(database, "vote"),
		where("createUser", "==", userUid)
	);
	const response = await getDocs(listQuery);
	response.forEach((doc) => data.push(doc.data()));

	return data;
}

// main
export default function Votelist() {
	const navigate = useNavigate();
	const [voteList, setVoteList] = useState<DocumentData[]>();

	// fucntions
	const onClickNavigate = (e: React.MouseEvent<HTMLDivElement>) => {
		const { id } = { id: e.currentTarget.id };
		voteList && navigate(id, { state: { voteInfo: voteList[parseInt(id)] } });
		return;
	};

	useEffect(() => {
		async function responseData() {
			const data = await MyVoteList();
			setVoteList(data);
		}
		responseData();

		return () => {};
	}, []);
	return (
		<>
			<h1>투표 관리</h1>
			<TableBox>
				<TableHeader>
					<div style={{ flex: 0.5, fontSize: "0.9rem" }}>No.</div>
					<div style={{ flex: 4, fontSize: "0.9rem" }}>title</div>
					<div style={{ flex: 2, fontSize: "0.9rem" }}>Annoymous</div>
					<div style={{ flex: 1.5, fontSize: "0.9rem" }}>Duplicate</div>
					<div style={{ flex: 1, fontSize: "0.9rem" }}>limit</div>
					<div style={{ flex: 1, fontSize: "0.9rem" }}>location</div>
					<div style={{ flex: 3, fontSize: "0.9rem" }}>createDate</div>
				</TableHeader>
				{voteList?.map((list, idx) => {
					const fireBaseTime = new Date(
						list.createTime.seconds * 1000 +
							list.createTime.nanoseconds / 1000000
					);
					const date = fireBaseTime.toLocaleDateString();

					return (
						<VoteBox key={idx} onClick={onClickNavigate} id={idx.toString()}>
							<div style={{ flex: 0.5, overflow: "clip" }}>{idx + 1}</div>
							<div style={{ flex: 4, overflow: "clip" }}>{list.title}</div>
							<div style={{ flex: 2, overflow: "clip" }}>
								{list.anonyOn ? "Y" : "N"}
							</div>
							<div style={{ flex: 1.5, overflow: "clip" }}>
								{list.doubleOn ? "Y" : "N"}
							</div>
							<div style={{ flex: 1, overflow: "clip" }}>{list.limit}</div>
							<div style={{ flex: 1, overflow: "clip" }}>
								{list.location ? list.location : "-"}
							</div>
							<div style={{ flex: 3, overflow: "clip" }}>{date}</div>
						</VoteBox>
					);
				})}
			</TableBox>
		</>
	);
}
