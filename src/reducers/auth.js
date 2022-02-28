// stateの初期値
const initialState = {
  isAuth: false,
};

// action（ログイン状態を管理）
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "GET_LOGIN_DATA":
      return { ...action.payload, isAuth: true };
    case "GET_LOGOUT_DATA":
      return initialState;
    default:
      return state;
  }
};

export default reducer;
