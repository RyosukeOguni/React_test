import React, { useState } from "react";
import axios from "axios";
import { restfulApiConfig } from "../components/modules/config";
import { useSelector, useDispatch } from "react-redux";
// セッション認証に必要な"X-Requested-With"をヘッダーに追加
axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";
axios.defaults.withCredentials = true;

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // storeの読込
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);

  // ログイン
  const login = async (e) => {
    e.preventDefault();
    // ログイン時にCSRFトークンを初期化
    axios
      .get(restfulApiConfig.apiURL + "sanctum/csrf-cookie")
      .then((response) => {
        axios
          .post(restfulApiConfig.apiURL + "api/auth/login", {
            email: email,
            password: password,
          })
          .then((res) => {
            console.log(res.data.message);
            dispatch({
              type: "GET_LOGIN_DATA",
              payload: { ...res.data.user, isAuth: true },
            });
          })
          .catch((err) => {
            console.log(err.response);
            console.log("[login]ログイン失敗");
          });
      });
  };

  // ログアウト
  const logout = () => {
    axios
      .post(restfulApiConfig.apiURL + "api/auth/logout")
      .then((res) => {
        dispatch({
          type: "GET_LOGOUT_DATA",
          payload: { isAuth: false },
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // ログインフォーム
  let form = (
    <form onSubmit={login}>
      <label>email</label>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <label>password</label>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">Login</button>
    </form>
  );

  // ユーザ情報
  let userInfo = null;

  // 認証済みの場合、ログアウトボタンとユーザ情報を表示
  if (auth.isAuth) {
    form = <button onClick={logout}>Logout</button>;
    userInfo = (
      <div>
        <h2>User</h2>
        <div>name: {auth.name}</div>
        <div>email: {auth.email}</div>
      </div>
    );
  }

  return (
    <div>
      {form}
      {userInfo}
    </div>
  );
};

export default Auth;
