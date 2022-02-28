import { combineReducers } from "redux";
import auth from "./auth";

// Storeの作成処理
const reducer = combineReducers({
  auth,
});

export default reducer;
