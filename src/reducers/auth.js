// action（ログイン状態を管理）
const reducer = (state = { isAuth: false }, { type, payload }) => {
  switch (type) {
    case "GET_LOGIN_DATA":
      return { ...payload, isAuth: true };
    case "GET_LOGOUT_DATA":
      return { isAuth: false };
    default:
      return state;
  }
};

export default reducer;
