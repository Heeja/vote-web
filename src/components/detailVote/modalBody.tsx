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

export default function ModalBody({
	data,
}: {
	data: { [key: string]: number };
}) {
	return Object.keys(data).map((key, idx) => {
		return (
			<Flex key={idx}>
				<FlexItem>{data[key]}</FlexItem>
				<FlexItem>
					<button>수정</button>
					<button>제거</button>
				</FlexItem>
			</Flex>
		);
	});
}
