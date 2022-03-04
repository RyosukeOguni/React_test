// action（アクセス結果を管理）
const reducer = (
  state = { open: false },
  { type, payload }
) => {
  switch (type) {
    case "HANDLE_OPEN":
      return { ...payload, open: true };
    case "HANDLE_CLOSE":
      return { open: false };
    default:
      return state;
  }
};

export default reducer;
