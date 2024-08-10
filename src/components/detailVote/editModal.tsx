import { DocumentData } from "firebase/firestore";
import { useState } from "react";
import styled from "styled-components";
import HeaderBody from "./headerBody";
import ModalBody from "./modalBody";
import {
	BasicButton,
	BasicColumnFlex,
	BasicFlex,
	WarningText,
} from "../../common/basicStyled";
import { IVoteItems } from "../../common/voteTypes";

const EditModalBox = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 0.5rem;
`;

const TitleInput = styled.input`
	border: none;
	width: 60%;
	text-align: center;
	font-size: 1.3rem;
`;

const ButtonBox = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	gap: 2rem;
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
	// const [editVoteInfo, setEditVoteInfo] = useState<DocumentData>(voteInfo);

	console.log(voteInfo);
	const headerList = ["항목", "추가/제거"];
	const votedCheck =
		voteInfo.items &&
		Object.values(voteInfo.items).find((value) => (value as number) > 0);

	// functions
	function InputChange(e: React.ChangeEvent<HTMLInputElement>) {
		const { value } = e.currentTarget;
		setVoteInfo((prev) => ({ ...prev, title: value }));
		return;
	}

	function SubmitChangeVoteInfo() {
		console.log("수정하기 요청");
		return;
	}
	return votedCheck ? (
		<BasicColumnFlex>
			<BasicFlex>
				<h3>투표 제목</h3>
				<h2>{voteInfo.title}</h2>
			</BasicFlex>
			<hr />
			<WarningText>투표가 진행되어 수정할 수 없습니다.</WarningText>
			<HeaderBody headerList={headerList} onSortResult={() => {}} />
			{voteInfo.items && (
				<ModalBody
					data={voteInfo.items}
					changeFunc={() => {}}
					disabled={true}
				/>
			)}
		</BasicColumnFlex>
	) : (
		<EditModalBox>
			<BasicFlex>
				<h3>투표 제목</h3>
				<TitleInput type="text" value={voteInfo.title} onChange={InputChange} />
			</BasicFlex>
			<hr />
			<HeaderBody headerList={headerList} onSortResult={() => {}} />

			{voteInfo.items &&
				// <ModalBody data={voteInfo.items} changeFunc={setvoteInfo} />
				voteInfo.items.map((item: IVoteItems, index) => {
					return (
						<div>
							<input
								type="text"
								value={item.itemName}
								disabled={false}
								onChange={() => {
									// todo: voteinfo를 바로 받아서 수정하는 부분 렌더링 효율 체크
									// 	itemName만 변경하는 로직 완성
									// setVoteInfo(prev => ({...prev, prev.items[idx].itemName}))
								}}
							/>
						</div>
					);
				})}

			<ButtonBox>
				<BasicButton onClick={onClose}>돌아가기</BasicButton>
				<BasicButton onClick={SubmitChangeVoteInfo}>수정하기</BasicButton>
			</ButtonBox>
		</EditModalBox>
	);
}
