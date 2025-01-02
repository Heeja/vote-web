import styled from "styled-components";

const ListBox = styled.div`
	display: flex;
	align-items: center;
	gap: 0.5rem;
`;
const ListItem = styled.div<{ flex: number }>`
	display: flex;
	flex: ${(props) => props.flex};
	justify-content: center;
	align-items: center;
	border: 0.05rem solid snow;
	padding: 0.3rem 0;
`;

interface IProps {
	memberName: string;
	seq: number;
	completed: boolean;
}
export default function MemberList({ memberName, seq, completed }: IProps) {
	return (
		<ListBox>
			<ListItem flex={1}>{seq + 1}</ListItem>
			<ListItem flex={2}>{memberName}</ListItem>
			<ListItem flex={1.5}>{completed ? "참여완료" : "미참여"}</ListItem>
		</ListBox>
	);
}
