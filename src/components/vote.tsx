import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
	collection,
	doc,
	getDocs,
	query,
	runTransaction,
	Timestamp,
	where,
} from "firebase/firestore";
import { auth, database } from "../routes/firebase";
import { useEffect, useState } from "react";
import styled from "styled-components";
import {
	BasicButton,
	BasicColumnFlex,
	CenterFlex,
	Flex,
} from "../common/basicStyled";
import { IVoteData, IVotedInfo } from "../common/voteTypes";
import Modal from "./Modal";

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
	min-height: 2rem;
	padding: 0.2rem;

	input {
		height: 100%;
		padding: 0.3rem;
	}
`;
const TextBox = styled.div`
	display: flex;
	font-weight: 700;
	font-size: medium;
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
	const anony = paramsURL.get("anony") === "true";

	const { id } = useParams();
	const [stateMessage, setStateMessage] = useState("로딩중..."); // 상태 메시지
	const [voteData, setVoteData] = useState<IVoteData>(); // api data 담을 공간
	const [voterName, setVoterName] = useState("");
	// 투표 반영할 선택값들
	const [selectItem, setSelectItem] = useState<string[]>([]);
	// 투표자 정보
	const [voteMember, setVoteMember] = useState<IVotedInfo[]>([]);

	const [modalBallot, setModalBallot] = useState(false); // 개표 모달 on|off

	// Functions
	/**
	 * id에 해당하는 투표 정보를 가져온다.
	 */
	const getVoteInfo = async () => {
		try {
			if (!anony) {
				// onAuthStateChanged를 사용하여 인증 상태 확인
				// auth.currentUser는 Auth가 비동기적으로 초기화되기 때문에 초기화 완료 전에 currentUser는 null이 된다.
				await new Promise<void>((resolve, reject) => {
					const unsubscribe = auth.onAuthStateChanged((user) => {
						if (user) {
							setVoteMember((prev) => ({
								...prev,
								id: user.uid,
								name: user.displayName as string,
							}));
							resolve();
						} else {
							reject(new Error("로그인이 필요합니다."));
						}
						unsubscribe();
					});
				});
			}
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
					setStateMessage("종료된 투표입니다.");
				} else if (rawData.completed.length >= rawData.limit) {
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
					} else {
						setVoteData(doc.data() as IVoteData);
					}
				}
			});
		} catch (error) {
			setStateMessage("정보 조회에 실패하였습니다.");
			return;
		}
	};
	/**
	 * 투표 정보 업데이트
	 */
	function SubmitVote() {
		try {
			if (selectItem.length < 1) throw new Error("빈 값");
			if (!voterName) throw new Error("투표자 이름을 입력해주세요");

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
					currentData.completed?.forEach((list) => {
						if (list.id && list.name === voterName) {
							throw new Error("이미 투표하셨습니다.");
						}
					});

					// 투표 마감(투표시간 종료, 상태 종료)
					if (
						!currentData.state ||
						currentData.closeTime.toDate() < new Date()
					) {
						throw new Error("투표가 종료되었습니다.");
					}

					// 투표 반영 값
					const updateItems = [...currentData.items].map((item) => {
						if (selectItem.includes(item.itemName)) {
							return { ...item, score: item.score + 1 };
						}
						return item;
					});
					// 투표자 기록
					const completed = currentData.completed
						? [...currentData.completed, ...voteMember]
						: voteMember;

					// 투표 반영(업데이트)
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
		setSelectItem([]);
	};
	useEffect(() => {
		getVoteInfo();
	}, []);

	useEffect(() => {
		const unsubscribe = auth.onAuthStateChanged((user) => {
			if (!user && !anony) {
				setStateMessage("비공개 투표는 로그인이 필요합니다.");
				navigate("/login"); // 로그인 페이지로 리다이렉트
			}
		});

		return () => unsubscribe(); // cleanup
	}, []);

	return (
		<>
			{modalBallot && (
				<Modal title="투표 현황" onClose={() => setModalBallot(false)}>
					<div>투표</div>
					<div>나는 칠드런...</div>
					<div>나도 나타나게 해줘</div>
				</Modal>
			)}
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
					onClick={() => navigate("/")}>
					뒤로가기
				</button>
			</CenterFlex>
			<hr />
			{voteData ? (
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
												// 선택시 색상 변경
												selectItem.includes(list.itemName)
													? "#94C9FF"
													: "whitesmoke"
											}`,
										}}
										onClick={() => {
											if (!voterName) {
												return alert("이름을 먼저 입력해주세요.");
											}
											// voteData.doubleOn
											// 선택 토글
											if (selectItem.includes(list.itemName)) {
												setSelectItem((prev) =>
													prev.filter((item) => item !== list.itemName)
												);
												setVoteMember((prev) =>
													prev.filter(
														(voted) => voted.itemName !== list.itemName
													)
												);
											} else {
												setSelectItem((prev) => {
													return voteData.doubleOn // 중복 가능 여부
														? [...prev, list.itemName]
														: [list.itemName];
												});
												setVoteMember((prev) => [
													...prev,
													{
														itemName: list.itemName,
														name: voterName,
														voteDate: Timestamp.fromDate(new Date()),
													},
												]);
											}
										}}>
										{selectItem.includes(list.itemName)
											? "선택완료"
											: "선택하기"}
									</BasicButton>
								</ItemName>
							</Flex>
						);
					})}
					<hr />
					<ButtonBox>
						{anony ? (
							<InputBox
								style={{
									display: "flex",
									justifyContent: "space-around",
									alignItems: "center",
									gap: "1rem",
								}}>
								<TextBox>
									<p
										style={{
											fontSize: 14,
											verticalAlign: "super",
											color: "#ff4141",
										}}>
										*
									</p>
									투표자:
								</TextBox>
								<input
									type="text"
									placeholder="이름"
									value={voterName}
									onChange={(e) => {
										const { value } = e.target;
										setVoterName(value);
									}}
								/>
							</InputBox>
						) : (
							voteData.secretBallot && (
								<BasicButton
									style={{ flex: 1, backgroundColor: "" }}
									onClick={() => setModalBallot(true)}>
									개표확인
								</BasicButton>
							)
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
