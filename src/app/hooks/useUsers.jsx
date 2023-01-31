import React, { useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import userService from "../services/user.service";
import { toast } from "react-toastify";
import Loader from "../components/common/loader";

const UserContext = React.createContext();

export const useUsers = () => {
  return useContext(UserContext);
};

const UserProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    getUsers();
  }, []);
  useEffect(() => {
    if (error !== null) {
      toast(error);
      setError(null);
    }
  }, [error]);

  const getUsers = async () => {
    try {
      const { content } = await userService.get();
      setUsers(content);
      setLoading(false);
    } catch (error) {
      errorCatcher(error);
      setLoading(false);
    }
  };

  function errorCatcher(error) {
    const { message } = error.response.data;
    setError(message);
  };

  function getUserById(userId) {
    return users.find((u) => u._id === userId);
  };

  return (
    <UserContext.Provider value={{ users, getUserById }}>
      {!isLoading ? children : <Loader />}
    </UserContext.Provider>
  );
};

UserProvider.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node])
};
export default UserProvider;
