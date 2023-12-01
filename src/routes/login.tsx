import styled from "styled-components";

const LoginForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;

  span {
    display: flex;
    gap: 10px;
  }
`;

function Login() {
  return (
    <>
      <h1>Login!</h1>
      <LoginForm>
        <input type="email" />
        <input type="password" />
        <span>
          <button type="submit">Login</button>
          <a href="/join">Join</a>
        </span>
      </LoginForm>
    </>
  );
}

export default Login;
