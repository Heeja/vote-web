import { DocumentData } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";

import Modal from "../components/Modal";
import VoteEditModal from "../components/detailVote/editModal";
import ResultBody from "../components/detailVote/resultBody";
import HeaderBody from "../components/detailVote/headerBody";
import TransformDateString from "../util/transformDateString";

// import { ReactComponent as SortUp } from "../asset/svg/sortUp.svg";
// import { ReactComponent as SortDown } from "../asset/svg/sortDown.svg";

const Box = styled.div`
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
const Button = styled.button`
	padding: 0.3rem 1rem;
	border: 0.08rem solid snow;
	font-size: 0.9rem;
`;

export default function Detailvote() {
	const navigate = useNavigate();
	const { state } = useLocation();
	const [voteInfo, setVoteInfo] = useState<DocumentData>();
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
	useEffect(() => {
		if (state.voteInfo) {
			const fireBaseTime = new Date(
				state.voteInfo.createTime.seconds * 1000 +
					state.voteInfo.createTime.nanoseconds / 1000000
			);

			setVoteInfo({
				...state.voteInfo,
				createTime: TransformDateString(fireBaseTime),
			});
		}

		return () => {};
	}, [state.voteInfo]);

	return (
		voteInfo && (
			<Box>
				<Title>{voteInfo.title}</Title>
				<SubText>생성일: {voteInfo.createTime}</SubText>
				<Body>
					<HeaderBody headerList={headerList} onSortResult={onSortResult} />
					<ResultBody data={voteInfo.items} />
				</Body>
				{editModal && (
					<Modal
						title={"투표 수정"}
						isVisible={editModal}
						onClose={() => setEditModal(false)}>
						<VoteEditModal
							voteInfo={voteInfo}
							setVoteInfo={setVoteInfo}
							onClose={() => setEditModal(false)}
						/>
					</Modal>
				)}
				<ButtonBox>
					<Button onClick={onGoBack}>뒤로가기</Button>
					<Button onClick={() => setEditModal((prev) => !prev)}>
						수정하기
					</Button>
				</ButtonBox>
			</Box>
		)
	);
}
