import { DocumentData } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import styled from "styled-components";

const Box = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	margin-top: 1rem;
	padding: 0 1rem 1rem 1rem;
`;
const Title = styled.h1`
	border-bottom: 0.1rem solid #fff;
`;
const Body = styled.div`
	> div:nth-child(2n) {
		background-color: #8899ff;
	}
`;
const Flex = styled.div<{ $type?: string }>`
	display: flex;
	width: 80vw;
	justify-content: space-around;
	align-items: center;
	background-color: ${(props) => props.$type === "header" && "#ff9999"};
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

export default function Detailvote() {
	const { state } = useLocation();
	const [voteInfo, setVoteInfo] = useState<DocumentData>();

	useEffect(() => {
		if (state.voteInfo) {
			const fireBaseTime = new Date(
				state.voteInfo.createTime.seconds * 1000 +
					state.voteInfo.createTime.nanoseconds / 1000000
			);
			setVoteInfo({
				...state.voteInfo,
				createTime: fireBaseTime.toLocaleDateString(),
			});
		}

		return () => {};
	}, [state.voteInfo]);

	return (
		voteInfo && (
			<Box>
				<Title>{voteInfo.title}</Title>
				<VoteResultHeader />
				<Body>
					<VoteResultBody data={voteInfo.items} />
				</Body>
			</Box>
		)
	);
}

function VoteResultHeader() {
	return (
		<Flex $type="header">
			<FlexItem $type="header">순서</FlexItem>
			<FlexItem $type="header">항목</FlexItem>
			<FlexItem $type="header">투표수</FlexItem>
			<FlexItem $type="header">점유율</FlexItem>
		</Flex>
	);
}

function VoteResultBody({ data }: { data: { [key: string]: number } }) {
	const totalResult: number[] = Object.values(data);
	const totalCount = totalResult.reduce((before, result) => before + result);

	return Object.keys(data).map((key, idx) => {
		const percent = data[key] === 0 ? 0 : (data[key] / totalCount) * 100;
		return (
			<Flex>
				<FlexItem>{idx + 1}</FlexItem>
				<FlexItem>{key}</FlexItem>
				<FlexItem>{data[key]}</FlexItem>
				<FlexItem>{percent}%</FlexItem>
			</Flex>
		);
	});
}
