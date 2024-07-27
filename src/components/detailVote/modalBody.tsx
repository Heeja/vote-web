import styled from "styled-components";
import { BasicButton } from "../../common/basicStyled";
import { DocumentData } from "firebase/firestore";
import { IVoteItems } from "../../common/voteTypes";
import { useState } from "react";

const Flex = styled.div<{ $type?: string }>`
	display: flex;
	width: 100%;
	justify-content: space-around;
	align-items: center;
	background-color: ${(props) => props.$type === "header" && "#ff999990"};
	color: ${(props) => props.$type === "header" && "snow"};
`;
const FlexItem = styled.div<{ $type?: string }>`
	flex: 1;
	display: flex;
	justify-content: center;
	align-items: center;
	overflow: visible;
	border-bottom: ${(props) =>
		props.$type !== "header" && "0.1rem solid #c6c6ff"};
	padding: 0.4rem 0;
	gap: 1rem;
	min-height: 2rem;
	height: 4rem;
`;

const ItemEditInput = styled.input``;

export default function ModalBody({
	data,
	changeFunc,
	disabled,
}: {
	data: IVoteItems[];
	changeFunc: React.Dispatch<React.SetStateAction<DocumentData>>;
	disabled?: boolean;
}) {
	const [copyList, setCopyList] = useState([...data]);

	// todo: focus 날라가는 것 수정!!!
	return copyList.map((item, idx) => {
		return (
			<Flex key={item.itemName}>
				<FlexItem>
					{disabled ? (
						<>{item.itemName}</>
					) : (
						<ItemEditInput
							value={item.itemName}
							onChange={(e) => {
								const { value } = e.target;
								setCopyList((prev) =>
									prev.map((item, prevIdx) =>
										idx === prevIdx ? { ...item, itemName: value } : item
									)
								);
							}}
						/>
					)}
				</FlexItem>
				<FlexItem>
					<BasicButton
						disabled={disabled}
						onClick={() => {
							console.log("수정");
						}}>
						수정
					</BasicButton>
					<BasicButton disabled={disabled}>제거</BasicButton>
				</FlexItem>
			</Flex>
		);
	});
}
