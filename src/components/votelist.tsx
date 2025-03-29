import { Suspense, useEffect, useState } from "react";
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
import Skeleton from "./Skeleton";

// styld Componnets

const TableBox = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	align-items: center;
	gap: 0.5rem;
	padding: 1rem 0.2rem;
	width: 100%;

	hr {
		margin: 0.2rem 0;
	}
`;
const VoteBox = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	width: 100%;
`;

const VoteInfoBox = styled.div<{ $flex: number }>`
	display: flex;
	justify-content: space-between;
	align-items: center;

	flex: ${(props) => props.$flex};
	width: 100%;
	text-align: center;
	font-size: 0.8rem;
	border: 0.1rem solid #e0c0c0;
	border-radius: 0.4rem;

	div {
		margin: 0.2rem 0;
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
	font-size: 0.8rem;
`;

const TableItem = styled.div<{ $flex: number }>`
	flex: ${(props) => props.$flex};
	width: "100%";
	padding: "0.2rem";
	overflow: "clip";
	border: "0.1rem solid #fff";
	font-size: small;
`;
const ShareBtn = styled.button`
	font-size: x-small;
	width: 100%;
	height: 1.4rem;
	border-radius: 1rem;
`;

// type interface
interface IVotelist {
	[key: string]: DocumentData;
}
[];
// firestore api
async function FirestroeVoteLists({
	userUid,
	collectionName,
	rangeCreateDate,
	rangeCloseDate,
}: {
	userUid: unknown;
	collectionName: string;
	rangeCreateDate?: { start: string; end: string };
	rangeCloseDate?: { start: string; end: string };
}) {
	const data: IVotelist[] = [];
	const options = [];
	if (rangeCreateDate) {
		options.push(
			where("createTime", ">=", rangeCreateDate.start),
			where("createTime", "<", rangeCreateDate.end)
		);
	}
	if (rangeCloseDate) {
		options.push(
			where("closeTime", "<", rangeCloseDate.end),
			where("closeTime", ">=", rangeCloseDate.start)
		);
	}
	const listQuery = query(
		collection(database, collectionName),
		where("createUser", "==", userUid),
		...options,
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

	// const [rangeCreateDate, setRangeCreateDate] = useState();
	// const [rangeCloseDate, setRangeCloseDate] = useState();

	// fucntions
	useEffect(() => {
		async function responseData() {
			setVoteList([]); // VoteList가 전체를 불러오기 때문에 기존 list는 초기화 후 다시 할당한다.
			await FirestroeVoteLists({
				userUid: userUid,
				collectionName: "privateVote",
			}).then((res) => {
				// todo: 중복값을 제거하고 넣는 것이 좋은지... 체크 후 수정
				// const resKeyList = res.filter((item) => {
				// 	const key = Object.keys(item)[0];
				// 	if (keyList.find((listKey) => listKey === key)) {
				// 		return false;
				// 	} else {
				// 		return true;
				// 	}
				// });
				// console.log("filter:", resKeyList);

				setVoteList((prev) => [...prev, ...res]);
			});
			await FirestroeVoteLists({
				userUid: userUid,
				collectionName: "publicVote",
			}).then((res) => {
				setVoteList((prev) => [...prev, ...res]);
			});
		}

		return () => {
			responseData();
		};
	}, []);

	return (
		<>
			<h1>투표 관리</h1>
			{/* todo: 생성일, 종료일 필터 생성 */}
			<TableBox>
				<TableHeader>
					<TableItem $flex={1}>No.</TableItem>
					<TableItem $flex={4}>Title</TableItem>
					<TableItem $flex={2}>Anony</TableItem>
					{/* <TableItem $flex={2}>Duple</TableItem>
					<TableItem $flex={3}>location</TableItem> */}
					<TableItem $flex={3}>Create</TableItem>
					<TableItem $flex={3}>Close</TableItem>
					<TableItem $flex={2}>Share</TableItem>
				</TableHeader>
				<hr />
				<Suspense fallback={<Skeleton variant="rounded" animation="wave" />}>
					{voteList
						?.sort((a, b) => {
							const key1 = Object.keys(a)[0];
							const key2 = Object.keys(b)[0];
							return b[key2].createTime.seconds - a[key1].createTime.seconds;
						})
						.map((list, idx) => {
							const key = Object.keys(list)[0];
							const createDate = list[key].createTime.toDate();
							const closeDate = list[key].closeTime.toDate();
							const createDateString = TransformDateString(
								createDate,
								"two-digit"
							);
							const closeDateString = TransformDateString(
								closeDate,
								"two-digit"
							);
							return (
								<VoteBox key={idx}>
									<VoteInfoBox
										$flex={8}
										onClick={() =>
											// todo: 투표 수정 페이지 이동으로 수정!
											// navigate(`/vote/${key}?anony=${list[key].anonyOn}`, {
											// 	state: { anony: list[key].anonyOn },
											// })
											navigate(`${key}?anony=${list[key].anonyOn}`, {
												state: { id: key, anony: list[key].anonyOn },
											})
										}
										id={key}
										data-idx={idx.toString()}>
										<TableItem $flex={1}>{idx + 1}</TableItem>
										<TableItem $flex={4}>{list[key].title}</TableItem>
										<TableItem $flex={2}>
											{list[key].anonyOn ? "Y" : "N"}
										</TableItem>
										{/* <TableItem $flex={2}>{list[key].doubleOn ? "Y" : "N"}</TableItem>
							<TableItem $flex={2}>{list[key].limit}</TableItem>
							<TableItem $flex={3}>{list[key].location ? "Y" : "-"}</TableItem> */}
										<TableItem $flex={3}>{createDateString}</TableItem>
										<TableItem $flex={3}>{closeDateString}</TableItem>
									</VoteInfoBox>

									<TableItem $flex={1}>
										<ShareBtn
											onClick={() => {
												navigator.clipboard
													.writeText(
														`${window.location.origin}/vote/${key}?anony=${list[key].anonyOn}`
													)
													.then(() => alert("주소가 복사되었습니다."))
													.catch((err) => alert(err));
												// window.navigator.share({
												// 	title: "투표 공유",
												// 	text: list[key].title,
												// 	url: `${window.location.origin}/vote/${key}?anony=${list[key].anonyOn}`,
												// });
											}}>
											공유
										</ShareBtn>
									</TableItem>
								</VoteBox>
							);
						})}
				</Suspense>
			</TableBox>
		</>
	);
}
