import React from "react";
import NavBar from "./components/ui/navBar";
import Users from "./components/layouts/users";
import { Redirect, Route, Switch } from "react-router-dom";
import Main from "./components/layouts/main";
import Login from "./components/layouts/login";
import { ToastContainer } from "react-toastify";
import { ProfessionProvider } from "./hooks/useProfession";
import { QualitiesProvider } from "./hooks/useQualities";
import AuthProvider from "./hooks/useAuth";
import ProtectedRoute from "./components/common/protectedRoute";
import LogOut from "./components/layouts/logOut";

export default function App() {
  return (
    <>
      <AuthProvider>
        <NavBar />

        <QualitiesProvider>
          <ProfessionProvider>
            <Switch>
              <ProtectedRoute path="/users/:userId?/:edit?" component={Users}/>
              <Route path="/login/:type?" component={Login}/>
              <Route path="/logout" component={LogOut}/>
              <Route exact path="/" component={Main}/>
              <Redirect to="/" />
            </Switch>
          </ProfessionProvider>
        </QualitiesProvider>
      </AuthProvider>

      <ToastContainer />
    </>
  );
}
