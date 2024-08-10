import { signOut } from "firebase/auth";
import { useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { auth } from "../routes/firebase";

const Wrapper = styled.div`
	position: relative;
	display: flex;
	flex-direction: column;
	align-items: center;
	width: 100%;

	> button {
		position: absolute;
		right: 5pt;
		top: 5pt;
	}
`;

const UserPageBox = styled.div`
	display: flex;
	justify-content: center;
	gap: 1rem;
	padding: 0.1rem 0.2rem;

	a {
		text-decoration-line: none;
		border: 0.1rem solid #e0c0c0;
		border-radius: 0.8rem;
		padding: 0.3rem 0.6rem;
		font-size: 0.9rem;
		text-align: center;
	}
`;

export default function User() {
	const [isLoading] = useState(false);
	const navigate = useNavigate();

	const Logout = () => {
		signOut(auth).then((res) => console.log(res));
		navigate("/");
	};

	return (
		<Wrapper>
			<h1>User Page.</h1>

			<button type="button" onClick={Logout}>
				Logout
			</button>

			<hr />
			<UserPageBox>
				<Link to={"createvote"}>Create vote</Link>
				<Link to={"managevote"}>Manage vote</Link>
				<Link to={"userInfo"}>User Info.</Link>
			</UserPageBox>
			<hr />
			{isLoading ? (
				<>
					<h1>Loading....</h1>
				</>
			) : (
				<Outlet />
			)}
		</Wrapper>
	);
}
