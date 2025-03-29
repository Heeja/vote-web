import { collection, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";

import Modal from "../components/Modal";
import VoteEditModal from "../components/detailVote/editModal";
import ResultBody from "../components/detailVote/resultBody";
import HeaderBody from "../components/detailVote/headerBody";
// import TransformDateString from "../util/transformDateString";
import { IVoteData } from "../common/voteTypes";
import { database } from "../routes/firebase";
import MemberList, { ListBox, ListItem } from "./detailVote/memberList";
import { TransformDateTimeString } from "../util/transformDateString";
import { end } from "../util/dates";

// import { ReactComponent as SortUp } from "../asset/svg/sortUp.svg";
// import { ReactComponent as SortDown } from "../asset/svg/sortDown.svg";

const Box = styled.div`
	width: 100%;
	display: flex;
	position: relative;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	margin-top: 1rem;
	padding: 0 1rem 1rem 1rem;
	gap: 1rem;
`;
const FlexBox = styled.div`
	width: 100%;
	display: flex;
	justify-content: space-between;
	align-items: center;
	gap: 1rem;
`;
const RightBox = styled.div`
	width: 70%;
	place-self: end;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: flex-end;
	padding: 0 0.5rem 0 0.5rem;
	gap: 1rem;
`;

const Title = styled.h1`
	text-align: center;
	border-bottom: 0.1rem solid #fff;
	margin: 0.3rem 0;
	font-weight: 700;
`;
const TimeBox = styled.div`
	display: flex;
	flex-direction: column;
	width: 100%;
`;
const SubText = styled.div`
	align-self: flex-end;
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	grid-template-rows: 1fr;
	grid-column-gap: 20px;
	justify-items: flex-end;
	font-size: 0.8rem;
	margin-bottom: 0.2rem;

	:last-child {
		font-size: 0.9rem;
		font-weight: 500;
	}
`;
const SmallText = styled.span`
	font-size: small;
`;
const SmallSubText = styled.span`
	font-size: x-small;
`;

const Body = styled.div`
	gap: 0;
	width: 100%;
	> div:nth-child(2n) {
		background-color: #889aff90;
	}
`;

const ButtonBox = styled.div`
	width: 100%;
	display: flex;
	justify-content: space-around;
	gap: 0.6rem;
`;
const Button = styled.button<{ disabled?: boolean }>`
	padding: 0.3rem 1rem;
	/* border: 0.08rem solid snow; */
	font-size: 0.9rem;
	color: ${(props) => (props.disabled ? "white" : "black")};
	cursor: pointer;
	&:hover {
		background-color: ${(props) => !props.disabled && "#f8ffa4"};
	}
`;

const ModalListBox = styled.div`
	display: flex;
	flex-direction: column;
	gap: 0.6rem;
`;

export default function Detailvote() {
	const navigate = useNavigate();
	const { state } = useLocation();
	const [dataState, setDataState] = useState(false);
	const [voteInfo, setVoteInfo] = useState<IVoteData>();
	const [enableEdit, setEnableEdit] = useState(false);
	const [editModal, setEditModal] = useState(false);
	const [memberView, setMemberView] = useState(false);

	const headerList = ["순서", "항목", "투표수", "점유율"];

	// functions
	const onGoBack = () => {
		navigate(-1);
		return;
	};

	const onSortResult = () => {
		return;
	};
	const getVoteInfo = async () => {
		try {
			const queryCollection = collection(
				database,
				state.anony ? "publicVote" : "privateVote"
			);
			const collectionWhere = where("__name__", "==", state.id);
			const fireQuery = query(queryCollection, collectionWhere);
			const data = await getDocs(fireQuery);

			if (data.empty) {
				// console.log("data.empty", data.empty);
				return { success: false, error: "조건에 맞는 문서가 없습니다." };
			}

			data.forEach((doc) => {
				setVoteInfo(doc.data() as IVoteData);
			});
		} catch (error) {
			console.log(error);
			return error;
		}
	};

	useEffect(() => {
		const readVoteData = () => {
			getVoteInfo()
				.then(() => {
					setDataState(true);
				})
				.catch((err) => {
					setDataState(false);
					console.log(err);
				});
		};
		return () => readVoteData();
	}, []);

	useEffect(() => {
		if (voteInfo) {
			voteInfo.items.forEach((item) => item.score > 0 && setEnableEdit(true));
		}
	}, [voteInfo]);

	return (
		<Box>
			{voteInfo && editModal && (
				<Modal title={"투표 수정"} onClose={() => setEditModal(false)}>
					<VoteEditModal
						voteData={{ title: voteInfo.title, items: voteInfo.items }}
						onClose={() => setEditModal(false)}
					/>
				</Modal>
			)}
			{memberView && (
				<Modal title={"투표 멤버"} onClose={() => setMemberView(false)}>
					<ModalListBox>
						{/* 리스트 헤더 */}
						<ListBox>
							<ListItem flex={1}>No</ListItem>
							<ListItem flex={2}>투표자</ListItem>
							{voteInfo?.secretBallot && (
								<ListItem flex={2}>투표 항목</ListItem>
							)}
						</ListBox>
						{/* 투표 리스트 */}
						{voteInfo?.completed && voteInfo.completed.length > 1 ? (
							voteInfo?.completed?.map((member, idx) => {
								return (
									<MemberList
										member={member}
										seq={idx}
										ballot={voteInfo.secretBallot}
									/>
								);
							})
						) : (
							<div>투표자가 없습니다.</div>
						)}
					</ModalListBox>
				</Modal>
			)}
			{dataState && voteInfo ? (
				<>
					<Title>{voteInfo.title}</Title>
					<RightBox>
						<FlexBox>
							<SmallText>생성일:</SmallText>
							<SmallText>
								{TransformDateTimeString(voteInfo.createTime.toDate())}
							</SmallText>
						</FlexBox>
						<FlexBox>
							<SmallText>종료일시:</SmallText>
							<SmallText>
								{end.toString() === voteInfo?.closeTime.toDate().toString()
									? "-"
									: TransformDateTimeString(voteInfo.closeTime.toDate())}
							</SmallText>
						</FlexBox>
					</RightBox>
					<Body>
						<HeaderBody headerList={headerList} onSortResult={onSortResult} />
						<ResultBody data={voteInfo.items} />
					</Body>

					<RightBox>
						<FlexBox>
							<SmallText>중복 선택:</SmallText>
							<SmallText>{voteInfo.doubleOn ? "Y" : "N"}</SmallText>
						</FlexBox>
						{/* <FlexBox>
						<SmallText>위치 지정 <SmallSubText>(반경500m)</SmallSubText>:</SmallText>
						<SmallText>{voteInfo.location}</SmallText>
						</FlexBox> */}
						<FlexBox>
							<SmallText>
								공개 투표 <SmallSubText>(Default: 비공개)</SmallSubText>:
							</SmallText>
							<SmallText>{voteInfo.anonyOn ? "Y" : "N"}</SmallText>
						</FlexBox>
						<FlexBox>
							<SmallText>개표 공개 여부:</SmallText>
							<SmallText>{voteInfo.secretBallot ? "Y" : "N"}</SmallText>
						</FlexBox>
						<FlexBox>
							<SmallText>
								제한인원 <SmallSubText>(최대 200명)</SmallSubText>:
							</SmallText>
							<SmallText>{voteInfo.limit}명</SmallText>
						</FlexBox>
					</RightBox>
					<hr />
					<Button onClick={() => setMemberView((prev) => !prev)}>
						투표 현황
					</Button>
					<ButtonBox>
						<Button onClick={onGoBack}>뒤로가기</Button>
						<Button
							disabled={enableEdit}
							onClick={() => setEditModal((prev) => !prev)}>
							수정하기
						</Button>
					</ButtonBox>
				</>
			) : (
				<div>Loading....</div>
			)}
		</Box>
	);
}
