import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
} from "@mui/material";

const ManualDialog = ({ status, handleDialogClose }) => {
  // propsの値を分割代入
  const { open, obj, type } = status;
  // useStateでstate変数とそのsetterを返す（React Hooks）
  const [data, setData] = useState({});
  // status(obj)の値が変わる毎に処理を実行　※DOMを読み込んでから値を適用
  useEffect(() => {
    setData(obj);
  }, [obj]);

  // Formの値を変更
  const handleChange = (event) => {
    // ...dataスプレッド構文で第1引数に入れることでプロパティのみを変更
    setData({ ...data, [event.target.name]: event.target.value });
  };

  // 登録（Post）
  const dataPostApi = async (data) => {
    // Objectをjson文字列に変換してjsonに変換
    const json = JSON.parse(JSON.stringify(data));
    await axios
      .post("http://localhost:8000/api/manual", json)
      .then((response) => {
        handleDialogClose({ type: type, data: response.data });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // 更新（Put）
  const dataPutApi = async (data) => {
    // Objectをjson文字列に変換してjsonに変換
    const json = JSON.parse(JSON.stringify(data));
    await axios
      .put(`http://localhost:8000/api/manual/${data.id}`, json)
      .then((response) => {
        handleDialogClose({ type: type, data: response.data });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <Dialog open={open} fullWidth maxWidth="lg">
      <DialogTitle id="draggable-dialog-title">ID:{data.id}</DialogTitle>
      <DialogContent>
        <Grid container spacing={1}>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              id="standard-basic"
              label="カテゴリID"
              name={"goods_category_id"}
              value={
                data.goods_category_id === undefined
                  ? ""
                  : data.goods_category_id
              }
              onChange={handleChange}
              margin="normal"
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              id="standard-basic"
              label="ブランドID"
              name={"brand_id"}
              value={data.brand_id === undefined ? "" : data.brand_id}
              onChange={handleChange}
              margin="normal"
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              id="standard-basic"
              label="商品名"
              name={"goods_name"}
              value={data.goods_name === undefined ? "" : data.goods_name}
              onChange={handleChange}
              margin="normal"
              fullWidth
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ padding: 2 }}>
        {(() => {
          if (type === "put") {
            return (
              <Button
                onClick={() => {
                  dataPutApi(data);
                  handleDialogClose({ type: type, data: data });
                }}
                variant="contained"
                color="primary"
              >
                更新
              </Button>
            );
          } else if (type === "post") {
            return (
              <Button
                onClick={() => {
                  dataPostApi(data);
                  handleDialogClose({ type: type, data: data });
                }}
                variant="contained"
                color="primary"
              >
                登録
              </Button>
            );
          }
        })()}

        <Button
          onClick={() => {
            handleDialogClose({ type: "" });
          }}
          color="primary"
        >
          キャンセル
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ManualDialog;
