import React, { useState, useEffect } from "react";
import Users from "./components/users";
import api from "./api";

export default function App() {
  const [users, setUsers] = useState(api.users.fetchAll());
  useEffect(() => {
    api.users.fetchAll().then((data) => setUsers(data));
  }, []);
  const handleDelete = (userId) => {
    setUsers((users) => users.filter((user) => user._id !== userId));
  };

  const handleToggleBookMark = (id) => {
    const newListUsers = users.map((user) => {
      if (user._id === id) {
        return { ...user, bookmark: !user.bookmark };
      }
      return user;
    });
    setUsers(newListUsers);
  };

  return (
    <div>
      <Users
        onDelete={handleDelete}
        onToggleBookMark={handleToggleBookMark}
        users={users}
      />
    </div>
  );
}
