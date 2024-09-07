import { useParams } from "react-router-dom";
import {
	collection,
	getDocs,
	query,
	runTransaction,
	Timestamp,
	updateDoc,
	where,
} from "firebase/firestore";
import { database } from "../routes/firebase";
import { useEffect, useState } from "react";
import styled from "styled-components";
import {
	BasicButton,
	BasicColumnFlex,
	CenterFlex,
	Flex,
} from "../common/basicStyled";

// styled components
// const Item = styled.div`
// 	width: 100%;
// 	display: flex;
// `;

// const Score = styled.div`
// 	padding-right: 0.3rem;
// 	display: flex;
// 	align-items: center;
// 	justify-content: center;
// 	min-width: 60px;
// 	/* justify-content: flex-end; */
// `;
const ItemName = styled.div`
	padding-right: 0.3rem;
	display: flex;
	justify-content: center;
	align-items: center;
	font-size: 0.9rem;
	text-align: center;
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

	// Functions
	const getVoteInfo = async () => {
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
				setVoteData([doc.data() as IVoteData]);
			});
		} catch (error) {
			console.log(error);
			return error;
		}
	};

	function SelectVote() {
		console.log("선택했다");
		return;
	}

	// Todo: 투표 반영 함수
	function SubmitVote() {
		// try {
		// 	await runTransaction(database, async (transaction) => {
		// 	  const sfDoc = await transaction.update();
		// 	  if (!sfDoc.exists()) {
		// 		throw "Document does not exist!";
		// 	  }
		// 	  const newPopulation = sfDoc.data().population + 1;
		// 	  transaction.update(sfDocRef, { population: newPopulation });
		// 	});
		// 	console.log("Transaction successfully committed!");
		//   } catch (e) {
		// 	console.log("Transaction failed: ", e);
		//   }
	}

	// useEffect(() => {
	// 	console.log(voteData);
	// }, [voteData]);

	return (
		<>
			<CenterFlex style={{ width: "100%", position: "relative" }}>
				<button
					style={{
						position: "absolute",
						left: 0,
						fontSize: "0.8rem",
						fontWeight: "bold",
						padding: "0.2rem 0.6rem",
					}}
					onClick={getVoteInfo}>
					뒤로가기
				</button>
				<h1>투표 페이지.</h1>
			</CenterFlex>
			<hr />
			{voteData?.map((data) => {
				return (
					<BasicColumnFlex key={id + "_" + data.title}>
						<h1>{data.title}</h1>
						<div
							style={{
								display: "flex",
								flexDirection: "column",
								width: "100%",
							}}>
							<hr />
							<Flex>
								<ItemName style={{ width: !data.secretBallot ? "40%" : "50%" }}>
									Outcome
								</ItemName>
								{!data.secretBallot && (
									<ItemName style={{ width: "20%" }}>Score</ItemName>
								)}
								<ItemName style={{ width: !data.secretBallot ? "40%" : "50%" }}>
									Button
								</ItemName>
							</Flex>
							<hr />
						</div>

						{data.items.map((list, idx) => {
							return (
								<Flex key={`${list.itemName}_${idx}`}>
									<ItemName
										style={{ width: !data.secretBallot ? "40%" : "50%" }}>
										{list.itemName}
									</ItemName>
									{!data.secretBallot && (
										<ItemName style={{ width: "20%" }}>{list.score}</ItemName>
									)}
									<ItemName
										style={{ width: !data.secretBallot ? "40%" : "50%" }}>
										<BasicButton
											style={{ backgroundColor: "whitesmoke" }}
											onClick={SelectVote}>
											투표하기
										</BasicButton>
									</ItemName>
								</Flex>
							);
						})}
						<hr />
						<div
							style={{
								display: "flex",
								justifyContent: "center",
								gap: "1rem",
								width: "80%",
							}}>
							<BasicButton
								style={{ flex: 1, backgroundColor: "tomato" }}
								onClick={() => {
									console.log("다시 투표");
								}}>
								다시
							</BasicButton>
							<BasicButton
								style={{ flex: 1, backgroundColor: "royalblue" }}
								onClick={() => {
									console.log("투표!");
								}}>
								확인
							</BasicButton>
						</div>
					</BasicColumnFlex>
				);
			})}
		</>
	);
}
