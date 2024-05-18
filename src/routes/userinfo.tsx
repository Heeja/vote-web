import { useEffect, useState } from "react";
import styled from "styled-components";
import firebaseSessionStorage from "../util/firebaseSessionStorage";

const UserForm = styled.form`
	display: flex;
	flex-direction: column;
	gap: 12px;

	span {
		display: flex;
		justify-content: flex-end;

		gap: 12px;
	}

	span:last-child {
		display: flex;
		justify-content: center;

		button {
			padding: 4px 12px;
		}
	}
`;

export default function Userinfo() {
	const [userInfo, setUserInfo] = useState({
		email: "",
		pw: "",
		pwcheck: "",
		name: "",
	});
	const sessionStorage = firebaseSessionStorage();

	// functions
	const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const targetId = e.target.id;
		const targetValue = e.target.value;

		if (targetId === "id") {
			setUserInfo({ ...userInfo, email: targetValue });
		}
		if (targetId === "pw") {
			setUserInfo({ ...userInfo, pw: targetValue });
		}
		if (targetId === "pwcheck") {
			setUserInfo({ ...userInfo, pwcheck: targetValue });
		}
		if (targetId === "name") {
			setUserInfo({ ...userInfo, name: targetValue });
		}
	};

	useEffect(() => {
		if (sessionStorage) {
			setUserInfo({
				email: sessionStorage.email,
				pw: "",
				pwcheck: "",
				name: sessionStorage.displayName,
			});
		}
	}, []);
	return (
		<>
			<h1>유저 정보 확인 및 수정</h1>
			<h2 style={{ color: "tomato" }}>비밀번호 변경 지원 예정</h2>
			<br />
			<UserForm>
				<span>
					<label htmlFor="email">Email</label>
					<input type="email" value={userInfo.email} onChange={onChange} />
				</span>
				<span>
					<label htmlFor="pw">Password</label>
					<input type="pw" value={userInfo.pw} onChange={onChange} disabled />
				</span>
				<span>
					<label htmlFor="pwcheck">PW Check</label>
					<input
						type="pwcheck"
						value={userInfo.pwcheck}
						onChange={onChange}
						disabled
					/>
				</span>
				<span>
					<label htmlFor="name">Name</label>
					<input type="name" value={userInfo.name} onChange={onChange} />
				</span>
				<span>
					<button style={{ background: "rgb(80 217 171)" }}>돌아가기</button>
					<button style={{ background: "rgb(255 234 109)" }}>수정</button>
				</span>
			</UserForm>
		</>
	);
}
