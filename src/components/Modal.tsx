import styled from "styled-components";

const ModalContatiner = styled.div`
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100vh;
	z-index: 100;
	display: flex;
	justify-content: center;
	align-items: center;
	background-color: rgb(0 0 0 0.4);
`;

const ModalBackDrop = styled.div`
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100vh;
	background-color: rgba(0, 0, 0, 0.5);
`;

const ModalContent = styled.div`
	position: relative;
	width: 100%;
	height: 100%;
	max-width: 360px;
	max-height: 735px;
	background-color: rgba(0, 0, 0, 0.5);
	border-radius: 10px;
	box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
	padding: 2rem;
	margin: 1rem;
`;

const ModalHeader = styled.div`
	width: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
	padding: 2rem;
	border-bottom: 1px solid #ddd;
	position: relative;
`;

const ModalTitle = styled.span`
	font-size: 18px;
	font-weight: bold;
`;

const ModalCloseButton = styled.div`
	position: absolute;
	display: flex;
	justify-content: center;
	align-items: center;
	right: 1rem;
	width: 1.5rem;
	height: 1.5rem;
	border: none;
	background-color: transparent;
	cursor: pointer;
	font-size: 1.2rem;
	text-align: center;
	align-content: center;

	:hover {
		background-color: #ddd;
	}
`;

const ModalBody = styled.div`
	width: 100%;
	padding: 0.6rem;
`;

interface IProps {
	title: string;
	onClose: () => void;
	children: React.ReactNode;
}

const Modal = ({ title, onClose, children }: IProps) => {
	return (
		<ModalContatiner>
			<ModalBackDrop onClick={onClose}></ModalBackDrop>
			<ModalContent>
				<ModalHeader>
					<ModalTitle>{title}</ModalTitle>
					<ModalCloseButton onClick={onClose}>&times;</ModalCloseButton>
				</ModalHeader>
				<ModalBody>{children}</ModalBody>
			</ModalContent>
		</ModalContatiner>
	);
};

export default Modal;
