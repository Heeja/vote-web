import { DocumentData } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";

import Modal from "../components/Modal";
import VoteEditModal from "../components/detailVote/editModal";
import ResultBody from "../components/detailVote/resultBody";
import HeaderBody from "../components/detailVote/headerBody";

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
`;
const TitleBox = styled.div`
	display: flex;
	position: relative;
	justify-content: center;
	align-items: center;
	width: 100%;
`;
const Title = styled.h1`
	border-bottom: 0.1rem solid #fff;
`;
const Body = styled.div`
	> div:nth-child(2n) {
		background-color: #889aff90;
	}
`;

const ButtonBox = styled.div`
	position: absolute;
	left: 1rem;
	display: flex;
	gap: 0.6rem;
`;
const Button = styled.button`
	padding: 0.3rem 1rem;
	border: 0.08rem solid snow;
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
				createTime: fireBaseTime.toLocaleDateString(),
			});
		}

		return () => {};
	}, [state.voteInfo]);

	return (
		voteInfo && (
			<Box>
				<TitleBox>
					<ButtonBox>
						<Button onClick={onGoBack}>뒤로가기</Button>
						<Button onClick={() => setEditModal((prev) => !prev)}>
							수정하기
						</Button>
					</ButtonBox>
					<Title>{voteInfo.title}</Title>
				</TitleBox>
				<HeaderBody headerList={headerList} onSortResult={onSortResult} />
				<Body>
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
			</Box>
		)
	);
}
