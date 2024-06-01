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

// styld Componnets

const TableBox = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	align-items: center;
	/* gap: 0.1rem; */
	border: 0.1rem solid #b1a85c;
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

// firestore api

async function MyVoteList() {
	const data: DocumentData[] = [];
	const userUid = firebaseSessionStorage().uid;
	const listQuery = query(
		collection(database, "vote"),
		where("createUser", "==", userUid),
		orderBy("createTime", "desc")
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
					<div
						style={{
							flex: 1,
							width: "100%",
							padding: "0.2rem",
							overflow: "clip",
						}}>
						No.
					</div>
					<div
						style={{
							flex: 5,
							width: "100%",
							padding: "0.2rem",
							overflow: "clip",
						}}>
						title
					</div>
					<div
						style={{
							flex: 2,
							width: "100%",
							padding: "0.2rem",
							overflow: "clip",
						}}>
						Annoymous
					</div>
					<div
						style={{
							flex: 2,
							width: "100%",
							padding: "0.2rem",
							overflow: "clip",
						}}>
						Duplicate
					</div>
					<div
						style={{
							flex: 1,
							width: "100%",
							padding: "0.2rem",
							overflow: "clip",
						}}>
						limit
					</div>
					<div
						style={{
							flex: 2,
							width: "100%",
							padding: "0.2rem",
							overflow: "clip",
						}}>
						location
					</div>
					<div
						style={{
							flex: 3,
							width: "100%",
							padding: "0.2rem",
							overflow: "clip",
						}}>
						createDate
					</div>
				</TableHeader>
				{voteList?.map((list, idx) => {
					const fireBaseTime = new Date(
						list.createTime.seconds * 1000 +
							list.createTime.nanoseconds / 1000000
					);
					const date = fireBaseTime.toLocaleDateString();

					return (
						<VoteBox key={idx} onClick={onClickNavigate} id={idx.toString()}>
							<div
								style={{
									flex: 1,
									width: "100%",
									padding: "0.2rem",
									overflow: "clip",
								}}>
								{idx + 1}
							</div>
							<div
								style={{
									flex: 5,
									width: "100%",
									padding: "0.2rem",
									overflow: "clip",
								}}>
								{list.title}
							</div>
							<div
								style={{
									flex: 2,
									width: "100%",
									padding: "0.2rem",
									overflow: "clip",
								}}>
								{list.anonyOn ? "Y" : "N"}
							</div>
							<div
								style={{
									flex: 2,
									width: "100%",
									padding: "0.2rem",
									overflow: "clip",
								}}>
								{list.doubleOn ? "Y" : "N"}
							</div>
							<div
								style={{
									flex: 1,
									width: "100%",
									padding: "0.2rem",
									overflow: "clip",
								}}>
								{list.limit}
							</div>
							<div
								style={{
									flex: 2,
									width: "100%",
									padding: "0.2rem",
									overflow: "clip",
								}}>
								{list.location ? "Y" : "-"}
							</div>
							<div
								style={{
									flex: 3,
									width: "100%",
									padding: "0.2rem",
									overflow: "clip",
								}}>
								{date}
							</div>
						</VoteBox>
					);
				})}
			</TableBox>
		</>
	);
}
