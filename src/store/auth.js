import { createStore } from "redux";

const initialState = {
  admin: { isAuth: false },
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "GET_LOGIN_DATA":
      return { ...state, admin: action.payload };
    default:
      return state;
  }
};

const store = createStore(reducer);

export default store;
