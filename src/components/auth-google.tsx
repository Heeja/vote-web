import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

import { auth } from "../routes/firebase";

const BtnBox = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;

  margin-top: 20px;
  padding: 4px 12px;

  font-weight: 600;
  font-size: 0.8rem;
  color: snow;

  cursor: pointer;
`;
const Logo = styled.img`
  width: 34px;
  height: 34px;
`;

export default function AuthGoogle() {
  const navigate = useNavigate();
  const onClick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider).then((res) => console.log(res)); // domain이 없어서 CORS 정책에 에러발생. 그래서 Redirect를 사용할 수 없다.

      navigate("/user");
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <BtnBox onClick={onClick}>
      <Logo src="./public/logo_G_light.svg" />
      Sign up with Google
    </BtnBox>
  );
}
