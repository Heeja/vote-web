import { useNavigate } from "react-router-dom";

export default async function SessionClean() {
	// todo: promise Error... in userinfo page..
	const navigate = useNavigate();

	sessionStorage.clear();
	await navigate("/login");
}
