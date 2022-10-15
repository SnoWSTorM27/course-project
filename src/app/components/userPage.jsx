import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import api from "../api";
import Loader from "./loader";
import QualitiesList from "./qualitiesList";

function UserPage() {
  const { userId } = useParams();
  const [user, setUser] = useState();
  useEffect(() => {
    api.users.getById(userId).then((data) => setUser(data));
  }, []);

  const history = useHistory();
  const goToUsersList = (hasUser) => {
    hasUser ? history.push("/users") : history.replace("/users");
  };

  if (user) {
    return (
      <>
        <h1>{user.name}</h1>
        <h2>Профессия: {user.profession.name}</h2>
        <QualitiesList qualities={user.qualities} />
        <p>completedMeetings: {user.completedMeetings}</p>
        <h3>Rate: {user.rate}</h3>
        <button onClick={() => goToUsersList(user)} >Все Пользователи</button>
      </>
    );
  }
  return <Loader />;
}

export default UserPage;
