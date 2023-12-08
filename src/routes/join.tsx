import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { auth } from "./firebase";

import { Form, Error, Switcher } from "../components/auth-components";
import AuthGoogle from "../components/auth-google";

// css - styled comnenets

export default function Join() {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState("");
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState({
    email: "",
    pw: "",
    name: "",
  });

  const [emailAlert, setEmailAlert] = useState(false);
  const [pwAlert, setPwAlert] = useState(false);
  const [nameAlert, setNameAlert] = useState(false);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const targetId = e.target.id;
    const targetValue = e.target.value;

    if (targetId === "email") {
      setUserInfo({ ...userInfo, email: targetValue });
    }
    if (targetId === "pw") {
      setUserInfo({ ...userInfo, pw: targetValue });
    }
    if (targetId === "name") {
      setUserInfo({ ...userInfo, name: targetValue });
    }
  };

  const userJoin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!userInfo.email) {
      setEmailAlert(true);
      return;
    } else setEmailAlert(false);

    if (!userInfo.pw) {
      setPwAlert(true);
      return;
    } else setPwAlert(false);

    if (!userInfo.name) {
      setNameAlert(true);
      return;
    } else setNameAlert(false);

    try {
      setIsLoading(true);
      // firebase send data
      const creditianlUser = await createUserWithEmailAndPassword(
        auth,
        userInfo.email,
        userInfo.pw
      );
      console.log(creditianlUser.user);
      await updateProfile(creditianlUser.user, { displayName: userInfo.name });

      navigate("/login");
    } catch (err) {
      if (err instanceof FirebaseError) {
        setIsError(err.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <h1>Join</h1>
      <Form onSubmit={userJoin}>
        <span>
          <label htmlFor="email">Email(ID)</label>
          <input
            type="email"
            id="email"
            placeholder="Email type"
            value={userInfo.email}
            onChange={onChange}
          />
        </span>
        {emailAlert ? (
          <span>
            <p>Email을 입력해주세요.</p>
          </span>
        ) : (
          ""
        )}
        <span>
          <label htmlFor="pw">Password</label>
          <input
            type="password"
            id="pw"
            placeholder="password"
            value={userInfo.pw}
            onChange={onChange}
          />
        </span>
        {pwAlert ? (
          <span>
            <p>입력하신 비밀번호를 다시 확인해주세요.</p>
          </span>
        ) : (
          ""
        )}
        <span>
          <label htmlFor="name">User Name</label>
          <input
            type="text"
            id="name"
            placeholder="Your Nickname"
            value={userInfo.name}
            onChange={onChange}
          />
        </span>
        {nameAlert ? (
          <span>
            <p>이름을 입력해주세요.</p>
          </span>
        ) : (
          ""
        )}
        <span>
          {isLoading ? (
            <span>
              <button>Loading...</button>
            </span>
          ) : (
            <button type="submit">Join</button>
          )}
        </span>
      </Form>
      {isError ? <Error>${isError}</Error> : ""}
      <Switcher>
        계정이 있다면 로그인하세요. <Link to="/login">Log in</Link>
      </Switcher>
      <AuthGoogle />
    </>
  );
}
