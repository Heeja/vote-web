import styled from "styled-components";

export const Flex = styled.div`
	display: flex;
	align-items: stretch;
	width: 100%;
	gap: 0.75rem;
`;
export const BasicFlex = styled.div`
	display: flex;
	align-items: center;
	gap: 0.5rem;
`;

export const BasicColumnFlex = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	text-align: center;
	gap: 0.5rem;
	width: 100%;
`;

export const BasicButton = styled.button`
	padding: 0.3rem 0.8rem;
`;

export const WarningText = styled.h3`
	color: #ff9e9e;
	/* text-shadow: #d6b6b6 0.1rem 0 0.2rem; */
	text-align: center;
	font-weight: 700;
`;
