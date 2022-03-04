import React, { useState } from "react";
import axios from "../modules/config";
import {
  Box,
  Grid,
  DialogActions,
  Alert,
  Typography,
  Button,
  TextField,
  Backdrop,
  CircularProgress,
} from "@mui/material";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const AuthModalInput = ({ handleClose }) => {
  const [accessError, setAccessError] = useState(false);
  // storeの読込
  const dispatch = useDispatch(); //action
  const auth = useSelector((state) => state.auth); //state
  const loading = useSelector((state) => state.loading);

  // 遷移先Hook
  const navigate = useNavigate();

  /* バリデーションルール */
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
  const login = (data) => {
    // ログイン時にCSRFトークンを初期化
    axios.get("sanctum/csrf-cookie").then(async (response) => {
      await dispatch({
        type: "REQUEST_FETCH_DATA",
      });

      await axios
        .post("api/auth/login", {
          email: data.email,
          password: data.password,
        })
        .then((res) => {
          dispatch({
            type: "GET_LOGIN_DATA",
            payload: { ...res.data.user }, // LOGINの場合、管理者情報をpayload
          });
          dispatch({
            type: "HANDLE_OPEN",
            payload: {
              open: true,
              type: "success",
              message: "ログインに成功しました。",
            },
          });
          navigate("/management");
          handleClose();
          dispatch({
            type: "SUCCESS_FETCH_DATA",
          });
        })
        .catch((error) => {
          dispatch({
            type: "HANDLE_OPEN",
            payload: {
              open: true,
              type: "error",
              message: `ログインに失敗しました。(コード：${error.response.status})`,
            },
          });
          dispatch({
            type: "SUCCESS_FETCH_DATA",
          });
          setAccessError(true);
        });
    });
  };

  // ログアウト
  const logout = async () => {
    dispatch({
      type: "REQUEST_FETCH_DATA",
    });
    await axios
      .post("api/auth/logout")
      .then((res) => {
        dispatch({
          type: "GET_LOGOUT_DATA", // LOGOUTの場合、reducers/auth.jsの初期値に戻す為payload不要
        });
        handleClose();
        navigate("/");
      })
      .catch((err) => {
        console.log(err);
      });
    dispatch({
      type: "SUCCESS_FETCH_DATA",
    });
  };

  function LoadArea() {
    return (
      <Backdrop open={loading.progress}>
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }

  return (
    <>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 500,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 2,
        }}
      >
        <Typography component="h3" variant="h6">
          {auth.isAuth ? "管理者情報" : "ログイン"}
        </Typography>
        {accessError && (
          <Alert sx={{ marginTop: "1em" }} severity="error">
            ログイン情報が違います
          </Alert>
        )}
        <Grid container spacing={1}>
          {auth.isAuth ? (
            <>
              <Grid item xs={12} sm={6}>
                <Typography component="h3" variant="h6">
                  name: {auth.name}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography component="h3" variant="h6">
                  email: {auth.email}
                </Typography>
              </Grid>
            </>
          ) : (
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
          )}
        </Grid>
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
      </Box>
      {loading.progress && <LoadArea />}
    </>
  );
};

export default AuthModalInput;
