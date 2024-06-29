import { DocumentData } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";

// import { ReactComponent as SortUp } from "../asset/svg/sortUp.svg";
// import { ReactComponent as SortDown } from "../asset/svg/sortDown.svg";

const Box = styled.div`
	display: flex;
	position: relative;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	margin-top: 1rem;
	padding: 0 1rem 1rem 1rem;
`;
const TitleBox = styled.div`
	display: flex;
	position: relative;
	justify-content: center;
	align-items: center;
	width: 100%;
`;
const Title = styled.h1`
	border-bottom: 0.1rem solid #fff;
`;
const Body = styled.div`
	> div:nth-child(2n) {
		background-color: #889aff90;
	}
`;
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
const Button = styled.button`
	position: absolute;
	left: 1rem;
	padding: 0.3rem 1rem;
	background-color: #172267;
	color: snow;
	border: 0.08rem solid snow;
`;

export default function Detailvote() {
	const navigate = useNavigate();
	const { state } = useLocation();
	const [voteInfo, setVoteInfo] = useState<DocumentData>();

	// functions
	const onGoBack = () => {
		navigate(-1);
		return;
	};

	const onSortResult = () => {
		return;
	};
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
				<TitleBox>
					<Button onClick={onGoBack}>뒤로가기</Button>
					<Title>{voteInfo.title}</Title>
				</TitleBox>
				<VoteResultHeader onSortResult={onSortResult} />
				<Body>
					<VoteResultBody data={voteInfo.items} />
				</Body>
			</Box>
		)
	);
}

function VoteResultHeader({ onSortResult }: { onSortResult: () => void }) {
	return (
		<Flex $type="header">
			<FlexItem $type="header" onClick={onSortResult}>
				순서
			</FlexItem>
			<FlexItem $type="header" onClick={onSortResult}>
				항목
			</FlexItem>
			<FlexItem $type="header" onClick={onSortResult}>
				투표수
			</FlexItem>
			<FlexItem $type="header" onClick={onSortResult}>
				점유율
			</FlexItem>
		</Flex>
	);
}

function VoteResultBody({ data }: { data: { [key: string]: number } }) {
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
