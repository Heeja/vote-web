import { useState } from "react";
import styled from "styled-components";

const JoinForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;

  span {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
  }
  span:last-child {
    display: flex;
    justify-content: center;

    button {
      padding: 0.4rem 1.2rem;
      background: lightyellow;
    }
  }
`;

export default function Join() {
  const [userInfo, setUserInfo] = useState({
    email: "",
    pw: "",
    pwcheck: "",
    name: "",
  });

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

  return (
    <>
      <h1>Join</h1>
      <JoinForm>
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
        <span>
          <label htmlFor="pwcheck">Password check</label>
          <input
            type="password"
            id="pwcheck"
            placeholder="password checked"
            value={userInfo.pwcheck}
            onChange={onChange}
          />
        </span>
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
        <span>
          <button type="submit">Join</button>
        </span>
      </JoinForm>
    </>
  );
}
