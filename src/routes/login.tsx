import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase";

import { Form, Switcher } from "../components/auth-components";
import AuthGoogle from "../components/auth-google";

function Login() {
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const id = e.target.id;
    const value = e.target.value;

    if (id === "email") {
      setLoginData({ ...loginData, email: value });
    }
    if (id === "password") {
      setLoginData({ ...loginData, password: value });
    }
  };

  const onLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    signInWithEmailAndPassword(auth, loginData.email, loginData.password)
      .then((res) => {
        console.log("user:", res.user);
        console.log("providerId:", res.providerId);
        console.log("operationType:", res.operationType);
      })
      .catch((err) => {
        const errCode = err.code;
        const errMsg = err.message;
        console.log(`code: ${errCode} / message: ${errMsg}`);
      })
      .finally(() => {
        navigate("/user");
      });
  };

  return (
    <>
      <h1>Login!</h1>
      <Form onSubmit={onLogin}>
        <input
          type="email"
          id="email"
          value={loginData.email}
          onChange={onChange}
        />
        <input
          type="password"
          id="password"
          value={loginData.password}
          onChange={onChange}
        />
        <span>
          <button type="submit">Login</button>
        </span>
      </Form>
      <Switcher>
        투표를 생성하려면 계정을 생성하세요. <Link to="/join">Join</Link>
      </Switcher>
      <AuthGoogle />
    </>
  );
}

export default Login;
