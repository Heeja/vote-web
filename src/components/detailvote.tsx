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

const Title = styled.h1`
	text-align: center;
	border-bottom: 0.1rem solid #fff;
	margin: 0.3rem 0;
`;

const SubText = styled.p`
	align-self: flex-end;
	font-size: 0.8rem;
	margin-bottom: 0.3rem;
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
	border: 0.08rem solid snow;
	font-size: 0.9rem;
	color: ${(props) => (props.disabled ? "white" : "black")};
`;

export default function Detailvote() {
	const navigate = useNavigate();
	const { state } = useLocation();
	const [dataState, setDataState] = useState(false);
	const [voteInfo, setVoteInfo] = useState<IVoteData>();
	const [enableEdit, setEnableEdit] = useState(false);
	const [editModal, setEditModal] = useState(false);

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
				console.log("data.empty", data.empty);
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
			{dataState && voteInfo ? (
				<>
					<Title>{voteInfo.title}</Title>
					<SubText>
						생성일: {voteInfo.createTime.toDate().toLocaleDateString()}
					</SubText>
					<Body>
						<HeaderBody headerList={headerList} onSortResult={onSortResult} />
						<ResultBody data={voteInfo.items} />
					</Body>
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
