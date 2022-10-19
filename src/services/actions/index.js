import {
  LOGIN,
  LOGOUT,
  CREATE_USER,
  GET_USER,
  UPDATE_USER,
  DELETE_USER,
} from "../constants";

export const login = (data) => {
  return {
    type: LOGIN,
    data: data,
  };
};

export const logout = (data) => {
  window.FB.logout();
  return {
    type: LOGOUT,
    data: data,
  };
};

export const createUser = (data) => {
  return {
    type: CREATE_USER,
    data: data,
  };
};

export const getUser = (data) => {
  return {
    type: GET_USER,
    data: data,
  };
};

export const updateUser = (data) => {
  return {
    type: UPDATE_USER,
    data: data,
  };
};

export const deleteUser = (data) => {
  return {
    type: DELETE_USER,
    data: data,
  };
};
