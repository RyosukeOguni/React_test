import React from "react";
import axios from "axios";
import { restfulApiConfig } from "../components/modules/config";

import { Grid, Button, TextField, DialogActions } from "@mui/material";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import { useSelector, useDispatch } from "react-redux";
// セッション認証に必要な"X-Requested-With"をヘッダーに追加
axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";
axios.defaults.withCredentials = true;

const AuthInput = ({ handleClose }) => {
  // storeの読込
  const dispatch = useDispatch(); //action
  const auth = useSelector((state) => state.auth); //state

  /* バリデーションルール 参照：https://github.com/jquense/yup　*/
  const schema = yup.object({
    email: yup
      .string()
      .email("メールアドレスを入力してください")
      .required("入力してください"),
    password: yup.string().required("入力してください"),
  });

  // Hook Formの設定
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  // ログイン
  const login = async (data) => {
    // ログイン時にCSRFトークンを初期化
    await axios
      .get(restfulApiConfig.apiURL + "sanctum/csrf-cookie")
      .then((response) => {
        axios
          .post(restfulApiConfig.apiURL + "api/auth/login", {
            email: data.email,
            password: data.password,
          })
          .then((res) => {
            console.log(res.data.message);
            dispatch({
              type: "GET_LOGIN_DATA",
              payload: { ...res.data.user }, // LOGINの場合、管理者情報をpayload
            });
            handleClose();
          })
          .catch((err) => {
            console.log(err.response);
            console.log("[login]ログイン失敗");
          });
      });
  };

  // ログアウト
  const logout = async () => {
    await axios
      .post(restfulApiConfig.apiURL + "api/auth/logout")
      .then((res) => {
        console.log(res.data.message);
        dispatch({
          type: "GET_LOGOUT_DATA", // LOGOUTの場合、reducers/auth.jsの初期値に戻す為payload不要
        });
        handleClose();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // ログインフォーム
  let inputArea = (
    <>
      <Grid item xs={12} sm={6}>
        <TextField
          id={"email"}
          label={"email"}
          type={"email"}
          {...register("email")}
          error={"email" in errors}
          helperText={errors["email"]?.message}
          required
          margin="normal"
          fullWidth
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          id={"password"}
          label={"password"}
          type={"password"}
          {...register("password")}
          error={"password" in errors}
          helperText={errors["password"]?.message}
          required
          margin="normal"
          fullWidth
        />
      </Grid>
    </>
  );

  // 認証済みの場合、ユーザ情報を表示
  if (auth.isAuth) {
    inputArea = (
      <>
        <h2>User</h2>
        <div>name: {auth.name}</div>
        <div>email: {auth.email}</div>
      </>
    );
  }

  return (
    <Grid container spacing={1}>
      {inputArea}
      <DialogActions>
        <Button
          onClick={auth.isAuth ? logout : handleSubmit((data) => login(data))}
          variant="contained"
          color="primary"
        >
          {auth.isAuth ? "ログアウト" : "ログイン"}
        </Button>
        <Button onClick={handleClose} color="primary">
          キャンセル
        </Button>
      </DialogActions>
    </Grid>
  );
};

export default AuthInput;
