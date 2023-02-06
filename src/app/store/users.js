import { createSlice, createAction } from "@reduxjs/toolkit";
import authService from "../services/auth.service";
import localStorageService from "../services/localStorage.service";
import userService from "../services/user.service";
import generateAuthError from "../utils/generateAuthError";
import getRandomInt from "../utils/getRandomInt";
import history from "../utils/history";

const initialState = localStorageService.getAccessToken() ? {
  entities: null,
  isLoading: true,
  error: null,
  auth: { userId: localStorageService.getUserId() },
  isLoggedIn: true,
  dataLoaded: false
} : {
  entities: null,
  isLoading: false,
  error: null,
  auth: null,
  isLoggedIn: false,
  dataLoaded: false
};

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    usersRequested: (state) => {
      state.isLoading = true;
    },
    usersReceived: (state, action) => {
      state.entities = action.payload;
      state.dataLoaded = true;
      state.isLoading = false;
    },
    usersRequestFailed: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    authRequested: (state) => {
      state.error = null;
    },
    authRequestSuccess: (state, action) => {
      state.auth = action.payload;
      state.isLoggedIn = true;
    },
    authRequestFailed: (state, action) => {
      state.error = action.payload;
    },
    userCreated: (state, action) => {
      if (!Array.isArray(state.entities)) {
        state.entities = [];
      }
      state.entities.push(action.payload);
    },
    userUpdated: (state, action) => {
      const indexUser = state.entities.findIndex(u => u._id === state.auth.userId);
      state.entities = [
        ...state.entities,
        state.entities[indexUser] = action.payload
      ];
      state.dataLoaded = false;
    },
    userLoggedOut: (state) => {
      state.entities = null;
      state.isLoggedIn = false;
      state.auth = null;
      state.dataLoaded = false;
    }
  }
});

const { actions, reducer: usersReducer } = usersSlice;
const {
  usersRequested,
  usersReceived,
  usersRequestFailed,
  authRequested,
  authRequestSuccess,
  authRequestFailed,
  userCreated,
  userLoggedOut,
  userUpdated
} = actions;

export const loadUsersList = () => async (dispatch) => {
  dispatch(usersRequested());
  try {
    const { content } = await userService.get();
    dispatch(usersReceived(content));
  } catch (error) {
    dispatch(usersRequestFailed(error.message));
  }
};

const userCreateRequested = createAction("users/userCreateRequested");
const userUpdateRequested = createAction("users/userUpdateRequested");
const createUserFailed = createAction("users/createUserFailed");
const updateUserFailed = createAction("users/updateUserFailed");

export const login = ({ payload, redirect }) => async (dispatch) => {
  const { email, password } = payload;
  dispatch(authRequested());
  try {
    const data = await authService.login({ email, password });
    dispatch(authRequestSuccess({ userId: data.localId }));
    localStorageService.setTokens(data);
    history.push(redirect);
  } catch (error) {
    const { code, message } = error.response.data.error;
    if (code === 400) {
      const errorMessage = generateAuthError(message);
      dispatch(authRequestFailed(errorMessage));
    } else {
      dispatch(authRequestFailed(error.message));
    }
  }
};

export const signUp = ({ email, password, ...rest }) => async (dispatch) => {
  dispatch(authRequested());
  try {
    const data = await authService.register({ email, password });
    localStorageService.setTokens(data);
    dispatch(authRequestSuccess({ userId: data.localId }));
    dispatch(createUser({
      _id: data.localId,
      email,
      rate: getRandomInt(1, 5),
      completedMeetings: getRandomInt(0, 200),
      image: `https://avatars.dicebear.com/api/avataaars/${(
        Math.random() + 1
      )
        .toString(36)
        .substring(7)}.svg`,
      ...rest
    }));
  } catch (error) {
    dispatch(authRequestFailed(error.message));
  }
};

export const updateUserData = (payload) => async (dispatch) => {
  dispatch(userUpdateRequested());
  try {
    const { content } = await userService.update(payload);
    console.log("Content", content);
    dispatch(userUpdated(content));
    history.push(`/users/${content._id}`);
  } catch (error) {
    dispatch(updateUserFailed(error.message));
  }
};

export const logOut = () => (dispatch) => {
  localStorageService.removeAuthData();
  dispatch(userLoggedOut());
  history.push("/");
};

function createUser(payload) {
  return async function (dispatch) {
    dispatch(userCreateRequested());
    try {
      const { content } = await userService.create(payload);
      dispatch(userCreated(content));
      history.push("/users");
    } catch (error) {
      dispatch(createUserFailed(error.message));
    }
  };
};

export const getUsers = () => (state) => state.users.entities;
export const getCurrentUserData = () => (state) => {
  return state.users.entities
    ? state.users.entities.find(u => u._id === state.users.auth.userId) : null;
};
export const getUsersLoadingStatus = () => (state) => state.users.isLoading;
export const getUserById = (id) => (state) => {
  if (state.users.entities) {
    return state.users.entities.find((p) => p._id === id);
  }
};
export const getIsLoggedIn = () => (state) => state.users.isLoggedIn;
export const getDataStatus = () => (state) => state.users.dataLoaded;
export const getCurrentUserId = () => (state) => state.users.auth.userId;
export const getAuthErrors = () => (state) => state.users.error;

export default usersReducer;
