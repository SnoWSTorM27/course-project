import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import api from "../../../api";
import Loader from "../../common/loader";
import Qualities from "../../ui/qualities";

function UserPage() {
  const { userId } = useParams();
  const [user, setUser] = useState();
  useEffect(() => {
    api.users.getById(userId).then((data) => setUser(data));
  }, []);

  const history = useHistory();
  const goToUserEdit = (hasUser) => {
    hasUser ? history.push(`/users/${userId}/edit`) : history.replace("/users");
  };

  if (user) {
    return (
      <>
        <h1>{user.name}</h1>
        <h2>Email: {user.email}</h2>
        <h2>Профессия: {user.profession.name}</h2>
        <Qualities qualities={user.qualities} />
        <p>completedMeetings: {user.completedMeetings}</p>
        <h3>Rate: {user.rate}</h3>
        <button onClick={() => goToUserEdit(user)} >Редактировать</button>
      </>
    );
  }
  return <Loader />;
}

export default UserPage;
