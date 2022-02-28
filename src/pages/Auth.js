import React, { useState, useEffect } from "react";
import axios from "axios";
import { restfulApiConfig } from "../components/modules/config";
import { useSelector, useDispatch } from "react-redux";
axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";
axios.defaults.withCredentials = true;

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const admin = useSelector((state) => state.admin);

  // 認証ユーザを取得
  const getUser = async () => {
    axios
      .get(restfulApiConfig.apiURL + "api/admin")
      .then((res) => {
        console.log(res.data);
        dispatch({
          type: "GET_LOGIN_DATA",
          payload: { ...res.data, isAuth: true },
        });
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  // ブラウザリロード時にログイン済みか判定
  useEffect(() => {
    getUser();
  }, []);

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
          type: "GET_LOGIN_DATA",
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
  if (admin.isAuth) {
    form = <button onClick={logout}>Logout</button>;
    userInfo = (
      <div>
        <h2>User</h2>
        <div>name: {admin.name}</div>
        <div>email: {admin.email}</div>
      </div>
    );
  }

  return (
    <div>
      {form}
      {userInfo}
      <button onClick={getUser}>getUser</button>
    </div>
  );
};

export default Auth;
