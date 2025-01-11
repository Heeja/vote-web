import styled from "styled-components";
import { IVotedInfo } from "../../common/voteTypes";

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
	border-radius: 0.3rem;
	padding: 0.3rem 0;
`;

interface IProps {
	member: IVotedInfo;
	seq: number;
	ballot?: boolean;
}
export default function MemberList({ member, seq, ballot }: IProps) {
	return (
		<ListBox>
			<ListItem flex={1}>{seq === -1 ? "No" : seq + 1}</ListItem>
			<ListItem flex={2}>{member.name}</ListItem>
			{ballot && <ListItem flex={2}>{member.itemName}</ListItem>}
		</ListBox>
	);
}
