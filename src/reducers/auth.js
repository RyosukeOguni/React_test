const initialState = {
  isAuth: false,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "GET_LOGIN_DATA":
      return { ...state, ...action.payload };
    case "GET_LOGOUT_DATA":
      return { ...action.payload };
    default:
      return state;
  }
};

export default reducer;
