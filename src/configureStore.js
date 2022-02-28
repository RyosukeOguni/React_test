import { createStore } from "redux";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";

import rootReducer from "./reducers";

// 永続化の設定
const persistConfig = {
  key: "root", // Storageに保存されるキー名を指定
  storage, // 保存先としてlocalStorageを設定
  whitelist: ["auth"], // `auth`をStorageに保存
};

// 永続化設定されたReducerとして定義（リロード時にLocalStorageからstoreにデータを渡す）
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Chrome機能拡張REDUX_DEVTOOLSを有効化する
const store = createStore(
  persistedReducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

export const persistor = persistStore(store);
export default store;
