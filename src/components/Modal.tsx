import { useEffect, useState } from "react";
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
	width: 500px;
	height: 500px;
	background-color: rgba(0, 0, 0, 0.5);
	border-radius: 10px;
	box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
`;

const ModalHeader = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 1rem;
	border-bottom: 1px solid #ddd;
`;

const ModalTitle = styled.span`
	font-size: 18px;
	font-weight: bold;
`;

const ModalCloseButton = styled.div`
	width: 30px;
	height: 30px;
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
	height: 100%;
	width: 100%;
	padding: 10px;
`;

interface IProps {
	title: string;
	isVisible: boolean;
	onClose: () => void;
	children: React.ReactNode;
}

const Modal = ({ title, isVisible, onClose, children }: IProps) => {
	const [, setIsModalOpen] = useState(isVisible);

	useEffect(() => {
		setIsModalOpen(isVisible);
	}, [isVisible]);

	const handleClose = () => {
		setIsModalOpen(false);
		onClose();
	};

	return (
		<ModalContatiner>
			<ModalBackDrop onClick={handleClose}></ModalBackDrop>
			<ModalContent>
				<ModalHeader>
					<ModalTitle>{title}</ModalTitle>
					<ModalCloseButton onClick={handleClose}>&times;</ModalCloseButton>
				</ModalHeader>
				<ModalBody>{children}</ModalBody>
			</ModalContent>
		</ModalContatiner>
	);
};

export default Modal;
