import React, {useState} from 'react';
import Users from './components/users';
import SearchStatus from './components/searchStatus';
import api from "./api"

export default function App() {
  const [users, setUsers] = useState(api.users.fetchAll());

  const handleDelete =(userId)=> {
    setUsers(users=>users.filter(user=>user._id!==userId))
  };

  const handleToggleBookMark =(id)=> {
    const newListUsers = users.map((user) => {
      if (user._id === id) {
        return {...user, bookmark: !user.bookmark};
      }
      return user;
    });
    setUsers(newListUsers);
  };

  return (
    <div>
      <SearchStatus length={users.length} />
      {(users.length !==0) ? 
      (<Users
        onDelete={handleDelete}
        onToggleBookMark={handleToggleBookMark}
        users = {users}
      />) : null}
    </div>
  );
}
