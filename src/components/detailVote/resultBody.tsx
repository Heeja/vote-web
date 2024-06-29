import styled from "styled-components";

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

export default function ResultBody({
	data,
}: {
	data: { [key: string]: number };
}) {
	const totalResult: number[] = Object.values(data);
	const totalCount = totalResult.reduce((before, result) => before + result);

	return Object.keys(data).map((key, idx) => {
		const percent = data[key] === 0 ? 0 : (data[key] / totalCount) * 100;
		return (
			<Flex key={idx}>
				<FlexItem>{idx + 1}</FlexItem>
				<FlexItem>{key}</FlexItem>
				<FlexItem>{data[key]}</FlexItem>
				<FlexItem>{percent}%</FlexItem>
			</Flex>
		);
	});
}
