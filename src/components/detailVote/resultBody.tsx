import styled from "styled-components";
import { IVoteItems } from "../../common/voteTypes";

const Flex = styled.div<{ $type?: string }>`
	display: flex;
	width: 80vw;
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

export default function ResultBody({ data }: { data: IVoteItems[] }) {
	const totalCount = data.reduce((before, result) => before + result.score, 0);

	return data.map((item, idx) => {
		const percent = item.score === 0 ? 0 : (item.score / totalCount) * 100;
		return (
			<Flex key={"Body-" + idx}>
				<FlexItem>{idx + 1}</FlexItem>
				<FlexItem>{item.itemName}</FlexItem>
				<FlexItem>{item.score}</FlexItem>
				<FlexItem>{percent}%</FlexItem>
			</Flex>
		);
	});
}
