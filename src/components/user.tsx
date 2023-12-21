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
`;

const UserPageBox = styled.div`
  display: flex;
  justify-content: center;

  gap: 20px;
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
      <div>
        <button type="button" onClick={Logout}>
          Logout
        </button>
      </div>
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
