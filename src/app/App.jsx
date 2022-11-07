import React from "react";
import NavBar from "./components/ui/navBar";
import Users from "./components/layouts/users";
import { Route, Switch } from "react-router-dom";
import Main from "./components/layouts/main";
import Login from "./components/layouts/login";
import EditUserForm from "./components/ui/editUserForm";

export default function App() {
  return (
    <>
      <NavBar />
      <Switch>
        <Route path="/users/:userId/edit" component={EditUserForm}/>
        <Route path="/users/:userId?" component={Users}/>
        <Route path="/login/:type?" component={Login}/>
        <Route exact path="/" component={Main}/>
      </Switch>
    </>
  );
}
