import { useEffect, useState } from "react";
import styled from "styled-components";

import HeaderBody from "./headerBody";

import { BasicButton, BasicFlex } from "../../common/basicStyled";
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
	font-size: 1.2rem;
`;
const EditList = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 1rem;
	margin: 1rem 0;
`;

const EditItem = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	gap: 0.5rem;
`;

const ButtonBox = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	gap: 2rem;
	padding: 0.5rem 0;
`;

interface IEditData {
	title: string;
	items: IVoteItems[];
}

export default function VoteEditModal({
	voteData,
	onClose,
}: {
	voteData: IEditData;
	onClose: () => void;
}) {
	const [editValues, setEditValues] = useState<IEditData>({
		title: "",
		items: [],
	});
	const [loading, setLoading] = useState(false);
	const [enableEditItems, setEnableEditItems] = useState(false);

	const headerList = ["항목"];

	// functions
	/**
	 * 수정 완료하기
	 */
	function SubmitChangeVoteInfo() {
		const editConfirm = confirm("수정하기");
		if (editConfirm) console.log("수정하기 요청!");
		return;
	}

	useEffect(() => {
		if (voteData) {
			setEditValues({ title: voteData.title, items: [...voteData.items] });
			setLoading(true);
			voteData.items.forEach(
				(item) => item.score > 0 && setEnableEditItems(true)
			);
		}
	}, []);

	return !loading ? (
		<div>Loading....</div>
	) : (
		<EditModalBox>
			<BasicFlex>
				<h3>투표 제목</h3>
				<TitleInput
					type="text"
					value={editValues.title}
					onChange={(e) =>
						setEditValues((prev) => ({ ...prev, title: e.target.value }))
					}
				/>
			</BasicFlex>
			<hr />
			<HeaderBody headerList={headerList} onSortResult={() => {}} />
			{/* <ModalBody data={editValues.items} changeFunc={() => {}} /> */}
			<EditList>
				{voteData.items.map((item: IVoteItems, index) => {
					return (
						<EditItem key={item.itemName + index}>
							<span>항목 {index + 1}</span>
							<input
								type="text"
								value={editValues.items[index].itemName}
								disabled={enableEditItems}
								onChange={(e) => {
									const updatedItems = editValues.items.map((item, i) =>
										i === index ? { ...item, itemName: e.target.value } : item
									);
									setEditValues((prev) => ({
										...prev,
										items: updatedItems,
									}));
								}}
							/>
						</EditItem>
					);
				})}
			</EditList>
			<ButtonBox>
				<BasicButton onClick={onClose}>돌아가기</BasicButton>
				<BasicButton onClick={SubmitChangeVoteInfo}>수정하기</BasicButton>
			</ButtonBox>
		</EditModalBox>
	);
}
