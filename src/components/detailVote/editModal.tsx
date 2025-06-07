import { useEffect, useState } from "react";
import styled from "styled-components";

import HeaderBody from "./headerBody";

import { BasicButton, BasicFlex } from "../../common/basicStyled";
import { IVoteData, IVoteItems } from "../../common/voteTypes";
import { doc, runTransaction } from "firebase/firestore";
import { database } from "../../routes/firebase";
import { areItemsEqualUnordered } from "../../util/voteItemEqual";

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
	state,
	voteData,
	syncData,
	onClose,
}: {
	state: { id: string; anony: boolean };
	voteData: IEditData;
	syncData: () => void;
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
		if (editConfirm) {
			runTransaction(database, async (transaction) => {
				// 트랜잭션 내에서 최신 데이터를 다시 읽어옴
				const voteRef = doc(
					database,
					state.anony ? "publicVote" : "privateVote",
					state.id as string
				);
				const currentDoc = await transaction.get(voteRef);
				const currentData = currentDoc.data() as IVoteData;

				console.log("기존 데이터 조회:", currentDoc, currentData);
				// 투표 진행여부 체크
				if (currentData.completed.length > 0) {
					throw new Error("투표가 진행되어 수정할 수 없습니다.");
				}

				// 투표 마감(투표시간 종료, 상태 종료)
				if (!currentData.state || currentData.closeTime.toDate() < new Date()) {
					throw new Error("종료된 투표입니다.");
				}

				// 변경 여부 체크 (변경 없을 시 무응답)
				if (areItemsEqualUnordered(editValues.items, currentData.items)) {
					throw new Error();
				}

				// 투표 업데이트
				transaction.update(voteRef, {
					title: editValues.title,
					items: editValues.items,
				});
			})
				.then(() => {
					alert("수정되었습니다!");
					syncData();
					onClose();
				})
				.catch((err) => {
					if (!err.message) return;
					alert(err.message);
					console.error("Transaction failed: ", err);
				});
		}
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
