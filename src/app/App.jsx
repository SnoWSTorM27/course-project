import React from "react";
import NavBar from "./components/navBar";
import Users from "./components/layouts/users";
import { Route, Switch } from "react-router-dom";
import Main from "./components/layouts/main";
import Login from "./components/layouts/login";
import UserPage from "./components/userPage";

export default function App() {
  return (
    <>
      <NavBar />
      <Switch>
        <Route path="/login" component={Login}/>
        <Route path="/users/:userId" render={(props) => (<UserPage {...props}/>)}/>
        <Route path="/users" component={Users}/>
        <Route exact path="/" component={Main}/>
      </Switch>
    </>
  );
}
