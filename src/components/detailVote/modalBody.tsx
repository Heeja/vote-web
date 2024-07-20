import styled from "styled-components";
import { BasicButton } from "../../common/basicStyled";
import { DocumentData } from "firebase/firestore";

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
	data: { [key: string]: number };
	changeFunc: React.Dispatch<React.SetStateAction<DocumentData>>;
	disabled?: boolean;
}) {
	// todo: firestore에 key: value로 저장되어서 key값이 항목이름으로 저장되었다.
	// 항목이름을 변경하려면 1. 기존 값을 지우고 새로운 값을 추가 | 2. 항목이름과 투표수를 나눠서 저장.
	return Object.keys(data).map((key, idx) => {
		return (
			<Flex key={idx}>
				<FlexItem>
					{disabled ? (
						<>{key}</>
					) : (
						<ItemEditInput value={key} onChange={() => {}} />
					)}
				</FlexItem>
				<FlexItem>
					<BasicButton disabled={disabled}>수정</BasicButton>
					<BasicButton disabled={disabled}>제거</BasicButton>
				</FlexItem>
			</Flex>
		);
	});
}
