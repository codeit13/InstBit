import { combineReducers } from "redux";

import userAuth from "./userAuth";

const createRootReducer = () =>
  combineReducers({
    userAuth,
  });

export default createRootReducer;
