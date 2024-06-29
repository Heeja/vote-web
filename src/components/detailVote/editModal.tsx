import { DocumentData } from "firebase/firestore";
import { useState } from "react";
import styled from "styled-components";
import HeaderBody from "./headerBody";

const EditModalBox = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 0.5rem;
`;

const TitleInput = styled.input`
	border: none;
	width: 60%;
`;

const ButtonBox = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
`;

export default function VoteEditModal({
	voteInfo,
	setVoteInfo,
	onClose,
}: {
	voteInfo: DocumentData;
	setVoteInfo: React.Dispatch<React.SetStateAction<DocumentData | undefined>>;
	onClose: () => void;
}) {
	const [editVoteInfo, setEditVoteInfo] = useState<DocumentData>(voteInfo);

	const headerList = ["항목", "추가/제거"];

	console.log(editVoteInfo);

	// functions
	function InputChange(e: React.ChangeEvent<HTMLInputElement>) {
		const { value } = e.currentTarget;
		setEditVoteInfo((prev) => ({ ...prev, title: value }));
		return;
	}

	console.log(editVoteInfo.items);
	return (
		<EditModalBox>
			<TitleInput
				type="text"
				value={editVoteInfo.title}
				onChange={InputChange}
			/>
			<HeaderBody headerList={headerList} onSortResult={() => {}} />

			<div>{/* todo: 수정할 공간 추가 */}</div>

			<ButtonBox>
				<button onClick={onClose}>돌아가기</button>
				<button>수정하기</button>
			</ButtonBox>
		</EditModalBox>
	);
}
