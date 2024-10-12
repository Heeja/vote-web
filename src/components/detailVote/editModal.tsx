import { useEffect, useState } from "react";
import styled from "styled-components";

import HeaderBody from "./headerBody";
import ModalBody from "./modalBody";
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
	font-size: 1.3rem;
`;

const ButtonBox = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	gap: 2rem;
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
			{editValues.items.map((item: IVoteItems, index) => {
				return (
					<div key={item.itemName + index}>
						<input
							type="text"
							value={item.itemName}
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
