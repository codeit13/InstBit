import { LOGIN, LOGOUT } from "../constants";
import { fetchStateFromLocalStorage } from "../utils/localStorage";

const persistedState = fetchStateFromLocalStorage("userAuth");

const INITIAL_STATE = {
  isLoggedin: false,
  user: null,
  ...persistedState,
};

export default function userAuth(state = INITIAL_STATE, action) {
  switch (action.type) {
    case LOGIN:
      return {
        ...state,
        isLoggedin: true,
        user: action.data,
      };
    case LOGOUT:
      return {
        ...state,
        isLoggedin: false,
        user: null,
      };
    default: {
      return state;
    }
  }
}
