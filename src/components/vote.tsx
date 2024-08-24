import { useParams } from "react-router-dom";
import {
	collection,
	getDocs,
	query,
	Timestamp,
	where,
} from "firebase/firestore";
import { database } from "../routes/firebase";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { BasicButton, Flex } from "../common/basicStyled";

// styled components
const Item = styled.div`
	width: 100%;
	display: flex;
`;
const ItemName = styled.div`
	flex: 4;
	padding-right: 0.3rem;
	display: flex;
	justify-content: center;
`;
const Score = styled.div`
	flex: 1;
	/* justify-content: flex-end; */
`;
// type interface
interface IVoteData {
	anonyOn: boolean;
	createTime: Timestamp;
	createUser: string;
	doubleOn: boolean;
	secretBallot: boolean;
	items: { itemName: string; score: number }[];
	limit: number;
	location: string;
	title: string;
}

export default function Vote() {
	const { id } = useParams();
	const [voteData, setVoteData] = useState<IVoteData[]>([]);

	async function getVoteInfo() {
		console.log("함수 시작!");
		try {
			// const docRef = doc(database, `vote/${id}`);
			const queryCollection = collection(database, "publicVote");
			const collectionWhere = where("__name__", "==", id);
			const fireQuery = query(queryCollection, collectionWhere);
			const data = await getDocs(fireQuery);

			if (data.empty) {
				console.log("data.empty", data.empty);
				return { success: false, error: "조건에 맞는 문서가 없습니다." };
			}

			// console.log(data.docs);
			data.forEach((doc) => {
				setVoteData((prev) => [...prev, doc.data() as IVoteData]);
			});
		} catch (error) {
			console.log(error);
			return error;
		}
	}

	useEffect(() => {
		console.log(voteData);
	}, [voteData]);

	return (
		<>
			<h1>투표 페이지.</h1>
			<button onClick={getVoteInfo}>실행</button>
			<hr />
			{voteData?.map((data) => {
				return (
					<div>
						<h1>{data.title}</h1>
						<hr />
						<Flex style={{ padding: "0.2rem 1rem" }}>
							<div style={{ flex: 4 }}>Outcome</div>
							{!data.secretBallot && <div style={{ flex: 1 }}>score</div>}
							<div style={{ flex: 2 }}>Button</div>
						</Flex>
						<hr />
						<div>
							{data.items.map((list, idx) => {
								return (
									<Flex style={{ padding: "0.2rem 1rem" }}>
										<Item key={`${list.itemName}_${idx}`}>
											<ItemName>
												<p>{list.itemName}</p>
											</ItemName>
											{!data.secretBallot && <Score>{list.score}</Score>}
											<BasicButton style={{ flex: 2 }}>투표하기</BasicButton>
										</Item>
									</Flex>
								);
							})}
						</div>
						<button
							onClick={() => {
								console.log("다시 투표");
							}}>
							다시
						</button>
						<button
							onClick={() => {
								console.log("투표!");
							}}>
							확인
						</button>
					</div>
				);
			})}
		</>
	);
}
