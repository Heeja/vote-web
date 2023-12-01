import { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import styled from "styled-components";

const UserPageBox = styled.div`
  display: flex;
  justify-content: center;

  gap: 20px;
`;

export default function User() {
  const [isLoading] = useState(false);
  return (
    <>
      <h1>User Page.</h1>
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
