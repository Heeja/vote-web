import {
	collection,
	DocumentData,
	getDocs,
	query,
	where,
} from "firebase/firestore";
import { database } from "./firebase";
import firebaseSessionStorage from "../util/firebaseSessionStorage";
import { useEffect, useState } from "react";
import styled from "styled-components";

// interface IVoteList {
// 	anonyOn: boolean;
// 	createTime: { seconds: number; nanoseconds: number };
// 	createUser: string;
// 	doubleOn: boolean;
// 	items: string[];
// 	limit: number;
// 	location: string;
// 	title: string;
// }

const TableBox = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	gap: 1rem;
`;

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

export default function Managevote() {
	const [voteList, setVoteList] = useState<DocumentData[]>();

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
			{voteList?.map((list, idx) => {
				return (
					<TableBox key={idx}>
						<div>{idx + 1}</div>
						<div>{list.title}</div>
						<div>{...list.items}</div>
						<div>{list.anonyOn}</div>
						<div>{list.doubleOn}</div>
						<div>{list.limit}</div>
						<div>{list.location}</div>
						<div>{new Date(list.createTime.seconds).toLocaleDateString()}</div>
					</TableBox>
				);
			})}
		</>
	);
}
