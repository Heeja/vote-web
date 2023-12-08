import { Link } from "react-router-dom";
import styled from "styled-components";

const BasicBox = styled.div`
  display: flex;
  gap: 1.2rem;
`;

export default function home() {
  return (
    <>
      <h1>Home!</h1>
      <BasicBox>
        <Link to="/login">Login</Link>
        <Link to="/join">Join</Link>
      </BasicBox>
    </>
  );
}
