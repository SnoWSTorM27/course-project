import React from 'react';
import api from "../api"

export default function Users() {
  console.log(api.users.fetchAll());

  return (

    <h1>Users</h1>
  )
}
