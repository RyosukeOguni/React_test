import { combineReducers } from "redux";
import auth from "./auth";
import loading from "./loading";
import access from "./access";

// 複数のreducerを一括して設定
const reducer = combineReducers({
  auth,
  loading,
  access,
});

export default reducer;
