import { combineReducers } from "redux";
import auth from "./auth";

// 複数のreducerを一括して設定
const reducer = combineReducers({
  auth,
});

export default reducer;
