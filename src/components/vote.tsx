import { useParams, useSearchParams } from "react-router-dom";
import {
	collection,
	doc,
	getDocs,
	query,
	runTransaction,
	Timestamp,
	where,
} from "firebase/firestore";
import { database } from "../routes/firebase";
import { useState } from "react";
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

interface ISelectItem {
	[key: number]: { itemName: string; score: number };
}

export default function Vote() {
	const [parameter] = useSearchParams();
	const { id } = useParams();
	const [voteData, setVoteData] = useState<IVoteData[]>([]);

	const [selectItem, setSelectItem] = useState<ISelectItem>({});

	// Functions
	const getVoteInfo = async () => {
		try {
			const queryCollection = collection(
				database,
				parameter.get("anony") === "true" ? "publicVote" : "privateVote"
			);
			const collectionWhere = where("__name__", "==", id);
			const fireQuery = query(queryCollection, collectionWhere);
			const data = await getDocs(fireQuery);

			if (data.empty) {
				console.log("data.empty", data.empty);
				return { success: false, error: "조건에 맞는 문서가 없습니다." };
			}

			data.forEach((doc) => {
				setVoteData([doc.data() as IVoteData]);
			});
		} catch (error) {
			console.log(error);
			return error;
		}
	};

	// Todo: 투표 반영 함수
	function SubmitVote() {
		try {
			if (Object.entries(selectItem).length < 1) throw new Error("빈값");

			// console.log({ ...voteData[0].items, ...selectItem });

			runTransaction(database, async (transaction) => {
				transaction.update(
					doc(
						database,
						parameter.get("anony") === "true" ? "publicVote" : "privateVote",
						"items"
					),
					{ ...voteData[0].items, ...selectItem }
				);
				//   if (!sfDoc) {
				// 	throw "Document does not exist!";
				//   }
				//   const newPopulation = sfDoc.data().population + 1;
				//   transaction.update(sfDocRef, { population: newPopulation });
			})
				.then((res) => console.log(res))
				.catch((err) => new Error(err));
			console.log("Transaction successfully committed!");
		} catch (e) {
			console.log("Transaction failed: ", e);
		}
	}

	console.log(voteData);

	return (
		<>
			<CenterFlex
				style={{ width: "100%", position: "relative", padding: "1rem 0" }}>
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
											style={{
												width: "100%",
												backgroundColor: `${
													selectItem[idx]?.itemName === list.itemName
														? "#94C9FF"
														: "whitesmoke"
												}`,
											}}
											onClick={() =>
												setSelectItem({
													[idx]: {
														itemName: list.itemName,
														score: list.score + 1,
													},
												})
											}>
											{selectItem[idx]?.itemName === list.itemName
												? "선택완료"
												: "선택하기"}
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
								style={{ flex: 1, backgroundColor: "tomato", color: "white" }}
								onClick={() => setSelectItem({})}>
								다시
							</BasicButton>
							<BasicButton
								style={{
									flex: 1,
									backgroundColor: "royalblue",
									color: "white",
								}}
								onClick={() => SubmitVote()}>
								확인
							</BasicButton>
						</div>
					</BasicColumnFlex>
				);
			})}
		</>
	);
}
