import { signOut } from "firebase/auth";
import { useState } from "react";
import { Link, Navigate, Outlet } from "react-router-dom";
import styled from "styled-components";
import { auth } from "../routes/firebase";

const UserPageBox = styled.div`
  display: flex;
  justify-content: center;

  gap: 20px;
`;

export default function User() {
  const [isLoading] = useState(false);

  const Logout = () => {
    signOut(auth).then((res) => console.log(res));
    <Navigate to={"/"} />;
  };

  return (
    <>
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
          {" "}
          <h1>Loading....</h1>{" "}
        </>
      ) : (
        <Outlet />
      )}
    </>
  );
}
