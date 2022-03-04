// action（ローディング状態を管理）
const reducer = (state = { progress: false }, { type, payload }) => {
  switch (type) {
    case "REQUEST_FETCH_DATA":
      return { progress: true };
    case "SUCCESS_FETCH_DATA":
      return { progress: false };
    default:
      return state;
  }
};

export default reducer;
