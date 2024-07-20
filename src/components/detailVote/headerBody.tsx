import styled from "styled-components";

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
	text-align: center;
	overflow: visible;
	border-bottom: ${(props) =>
		props.$type !== "header" && "0.1rem solid #c6c6ff"};
	padding: 0.4rem 0;
`;

export default function HeaderBody({
	headerList,
	onSortResult,
}: {
	headerList: string[];
	onSortResult: () => void;
}) {
	return (
		<Flex $type="header">
			{headerList.map((text, idx) => {
				return (
					<FlexItem key={"header-" + idx} $type="header" onClick={onSortResult}>
						{text}
					</FlexItem>
				);
			})}
		</Flex>
	);
}
