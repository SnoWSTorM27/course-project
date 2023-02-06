import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { useSelector, useDispatch } from "react-redux";
import { getIsLoggedIn, getUsersLoadingStatus, loadUsersList } from "../../../store/users";
import { loadQualitiesList } from "../../../store/qualities";
import { loadProfessionsList } from "../../../store/professions";
import Loader from "../../common/loader";

const AppLoader = ({ children }) => {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector(getIsLoggedIn());
  const usersStatusLoading = useSelector(getUsersLoadingStatus());
  useEffect(() => {
    dispatch(loadQualitiesList());
    dispatch(loadProfessionsList());
    if (isLoggedIn) {
      dispatch(loadUsersList());
    }
  }, [isLoggedIn]);
  if (usersStatusLoading) return <Loader />;

  return children;
};
AppLoader.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node])
};

export default AppLoader;
