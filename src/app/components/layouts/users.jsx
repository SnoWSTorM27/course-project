import React from "react";
import { useParams } from "react-router-dom";
import UserPage from "../page/userPage";
import UsersLisrPage from "../page/usersListPage";

function Users() {
  const params = useParams();
  const { userId } = params;

  return (
    <>
      {userId ? <UserPage userId={userId} /> : <UsersLisrPage />}
    </>
  );
}

export default Users;
