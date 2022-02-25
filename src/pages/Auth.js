import React, { useState, useEffect } from "react";
import axios from "axios";
import { restfulApiConfig } from "../components/modules/config";
axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";
axios.defaults.withCredentials = true;

const Auth = () => {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // ブラウザリロード時にログイン済みか判定
  useEffect(() => {
    getUser();
  }, []);

  // 認証ユーザを取得
  const getUser = () => {
    axios
      .get(restfulApiConfig.apiURL + "admin")
      .then((res) => {
        console.log("[getUser]ログイン済み");
        console.log(res.data);
        setUser(res.data);
      })
      .catch((err) => {
        console.log("[getUser]ログインしてません");
      });
  };

  // ログイン
  const login = async (e) => {
    e.preventDefault();
    // ログイン時にCSRFトークンを初期化
    axios.get("http://localhost:8000/sanctum/csrf-cookie").then((response) => {
      axios
        .post(restfulApiConfig.apiURL + "auth/login", {
          email: email,
          password: password,
        })
        .then((res) => {
          console.log(res.data);
          if (res.data) {
            console.log("[login]ログイン成功");
            setUser(res.data.user);
          } else {
            console.log(res.data.message);
            console.log("[login]ログイン失敗");
          }
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
      .post(restfulApiConfig.apiURL + "auth/logout")
      .then((res) => {
        setUser(null);
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
  if (user) {
    form = <button onClick={logout}>Logout</button>;
    userInfo = (
      <div>
        <h2>User</h2>
        <div>name: {user.name}</div>
        <div>email: {user.email}</div>
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
