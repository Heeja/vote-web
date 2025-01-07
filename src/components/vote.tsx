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
import { IVoteData, IVoteItems } from "../common/voteTypes";

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
const ButtonBox = styled.div`
	display: flex;
	justify-content: center;
	gap: 1rem;
	width: 80%;
`;
const InputBox = styled.div`
	display: flex;
	justify-content: space-around;
	align-items: center;
	gap: 1rem;
	margin: 0.4rem 0;
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
	const [voteData, setVoteData] = useState<IVoteData>();
	const [selectItem, setSelectItem] = useState<IVoteItems>({
		itemName: "",
		score: 0,
	});
	const [voteMember, setVoteMember] = useState("");

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
				const rawData = doc.data();

				if (!rawData.state || rawData.closeTime.toDate() < new Date()) {
					setState(false);
					setStateMessage("종료된 투표입니다.");
				} else if (rawData.completed.length >= rawData.limit) {
					setState(false);
					setStateMessage("투표인원이 가득찼습니다.");
				} else {
					if (anony) {
						const filteredData: IVoteData = {
							title: rawData.title,
							items: rawData.items,
							secretBallot: rawData.secretBallot,
							anonyOn: rawData.anonyOn,
							createUser: rawData.createUser,
							createTime: rawData.createTime,
							closeTime: rawData.closeTime,
							state: rawData.state,
							doubleOn: rawData.doubleOn,
							limit: rawData.limit,
							location: rawData.location,
						};
						setVoteData(filteredData);
						setState(true);
					} else {
						setVoteData(doc.data() as IVoteData);
						setState(true);
					}
				}
			});
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
			if (!selectItem.itemName) throw new Error("빈 값");
			if (!voteMember) throw new Error("투표자 이름을 입력해주세요");

			if (voteData) {
				runTransaction(database, async (transaction) => {
					// 트랜잭션 내에서 최신 데이터를 다시 읽어옴
					const voteRef = doc(
						database,
						anony ? "publicVote" : "privateVote",
						id as string
					);
					const currentDoc = await transaction.get(voteRef);
					const currentData = currentDoc.data() as IVoteData;

					// 이미 투표했는지 확인
					if (currentData.completed?.includes(voteMember)) {
						throw new Error("이미 투표하셨습니다!");
					}
					if (
						!currentData.state ||
						currentData.closeTime.toDate() < new Date()
					) {
						throw new Error("투표가 종료되었습니다.");
					}
					console.log(currentData.closeTime);

					const updateItems = [...currentData.items].map((item) => {
						if (item.itemName === selectItem.itemName) {
							return { ...item, score: item.score + 1 };
						}
						return item;
					});
					const completed = currentData.completed
						? [...currentData.completed, voteMember]
						: [voteMember];

					// 검증이 완료된 후 업데이트
					transaction.update(voteRef, { items: updateItems, completed });
				})
					.then(() => {
						alert("투표가 완료되었습니다!");
						navigate("/");
					})
					.catch((err) => {
						alert(err.message);
						console.error("Transaction failed: ", err);
					});
			}
		} catch (e) {
			alert(e instanceof Error ? e.message : "투표 중 오류가 발생했습니다");
			console.error("투표 실패: ", e);
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
					<ButtonBox>
						{!anony ? (
							<BasicButton>개표 보기</BasicButton>
						) : (
							<InputBox
								style={{
									display: "flex",
									justifyContent: "space-around",
									alignItems: "center",
									gap: "1rem",
								}}>
								<div>*투표자:</div>
								<input
									type="text"
									placeholder="이름"
									value={voteMember}
									onChange={(e) => {
										const { value } = e.target;
										setVoteMember(value);
									}}
								/>
							</InputBox>
						)}
					</ButtonBox>
					<ButtonBox>
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
					</ButtonBox>
				</BasicColumnFlex>
			) : (
				<div>{stateMessage}</div>
			)}
		</>
	);
}
