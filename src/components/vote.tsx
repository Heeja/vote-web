import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
	collection,
	doc,
	getDocs,
	query,
	runTransaction,
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
import { IVoteData, IVoteDataExtends, IVoteItems } from "../common/voteTypes";

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

/**
 * 투표 페이지
 * @description 링크를 통해 투표 페이지 접속. 공개 여부를 가지고 접속 필터
 * @param id 받아올 투표 ID
 * @param anony 비공개 | 공개 투표 여부 체크
 */
export default function Vote() {
	const navigate = useNavigate();

	const location = useLocation();
	const paramsURL = new URLSearchParams(location.search);
	const anony = paramsURL.get("anony");

	const { id } = useParams();
	const [state, setState] = useState(false);
	const [stateMessage, setStateMessage] = useState("로딩중...");
	const [voteData, setVoteData] = useState<IVoteData | IVoteDataExtends>();
	const [selectItem, setSelectItem] = useState<IVoteItems>({
		itemName: "",
		score: 0,
	});

	// Functions

	/**
	 * id에 해당하는 투표 정보를 가져온다.
	 */
	const getVoteInfo = async () => {
		try {
			const queryCollection = collection(
				database,
				anony ? "publicVote" : "privateVote"
			);
			const collectionWhere = where("__name__", "==", id);
			const fireQuery = query(queryCollection, collectionWhere);
			const data = await getDocs(fireQuery).catch((err) => {
				throw err;
			});

			if (data.empty) {
				console.log("data.empty", data.empty);
				setStateMessage("조건에 맞는 문서를 찾을 수 없습니다.");
				return { success: false, error: "조건에 맞는 문서가 없습니다." };
			}

			data.forEach((doc) => {
				// 공개 투표일 경우 데이터 필터
				if (anony) {
					const rawData = doc.data();
					const filteredData: IVoteData = {
						title: rawData.title,
						items: rawData.items,
						secretBallot: rawData.secretBallot,
						anonyOn: rawData.anonyOn,
						createTime: rawData.createTime,
						createUser: rawData.createUser,
						doubleOn: rawData.doubleOn,
						limit: rawData.limit,
						location: rawData.location,
					};
					setVoteData(filteredData);
				} else {
					setVoteData(doc.data() as IVoteDataExtends);
				}
			});
			setState(true);
		} catch (error) {
			setState(false);
			setStateMessage("정보 조회에 실패하였습니다.");
			return;
		}
	};

	/**
	 * 투표 정보 업데이트
	 */
	function SubmitVote() {
		try {
			if (Object.entries(selectItem).length < 1) throw new Error("빈 값");

			if (voteData) {
				const updateItems = [...voteData.items].map((item) => {
					if (item.itemName === selectItem.itemName) {
						return { ...item, score: selectItem.score };
					}
					return item;
				});

				console.log(
					doc(database, anony ? "publicVote" : "privateVote", id as string)
				);

				runTransaction(database, async (transaction) => {
					transaction.update(
						doc(database, anony ? "publicVote" : "privateVote", id as string),
						{ items: updateItems }
					);
				})
					.then(() => getVoteInfo())
					.catch((err) => new Error(err));
				console.log("업데이트 성공!!(Transaction successfully committed!)");
			} else {
				throw new Error("투표 정보가 없습니다.");
			}
		} catch (e) {
			console.log("업데이트 실패(Transaction failed): ", e);
		}
	}

	/**
	 *
	 */
	const resetVote = () => {
		setSelectItem({ itemName: "", score: 0 });
	};
	useEffect(() => {
		getVoteInfo();
	}, []);

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
					onClick={() => navigate(-1)}>
					뒤로가기
				</button>
			</CenterFlex>
			<hr />
			{state && voteData ? (
				<BasicColumnFlex key={id + "_" + voteData.title}>
					<h1>{voteData.title}</h1>
					<div
						style={{
							display: "flex",
							flexDirection: "column",
							width: "100%",
						}}>
						<hr />
						<Flex>
							<ItemName
								style={{ width: !voteData.secretBallot ? "40%" : "50%" }}>
								Outcome
							</ItemName>
							{!voteData.secretBallot && (
								<ItemName style={{ width: "20%" }}>Score</ItemName>
							)}
							<ItemName
								style={{ width: !voteData.secretBallot ? "40%" : "50%" }}>
								Button
							</ItemName>
						</Flex>
						<hr />
					</div>

					{voteData?.items.map((list, idx) => {
						return (
							<Flex key={`${list.itemName}_${idx}`}>
								<ItemName
									style={{ width: !voteData.secretBallot ? "40%" : "50%" }}>
									{list.itemName}
								</ItemName>
								{!voteData.secretBallot && (
									<ItemName style={{ width: "20%" }}>{list.score}</ItemName>
								)}
								<ItemName
									style={{ width: !voteData.secretBallot ? "40%" : "50%" }}>
									<BasicButton
										style={{
											width: "100%",
											backgroundColor: `${
												selectItem?.itemName === list.itemName
													? "#94C9FF"
													: "whitesmoke"
											}`,
										}}
										onClick={() => {
											if (
												selectItem.itemName === list.itemName &&
												selectItem.score > 0
											) {
												resetVote();
											} else {
												setSelectItem({
													score: list.score + 1,
													itemName: list.itemName,
												});
											}
										}}>
										{selectItem?.itemName === list.itemName
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
							onClick={resetVote}>
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
			) : (
				<div>{stateMessage}</div>
			)}
		</>
	);
}
