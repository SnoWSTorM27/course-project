import React from "react";
import { useParams } from "react-router-dom";
import UserPage from "../page/userPage";
import UsersLisrPage from "../page/usersListPage";
import EditUserPage from "../page/editUserPage";

function Users() {
  const params = useParams();
  const { userId, edit } = params;

  return (
    <>
      {userId ? (
        edit ? (
          <EditUserPage />
        ) : (
          <UserPage userId={userId} />
        )
      ) : (
        <UsersLisrPage />
      )}
    </>
  );
}

export default Users;
