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

const ManualDialog = ({ status, handleDialogClose, handleDialogPut }) => {
  // useStateでstate変数とそのsetterを返す（React Hooks）
  const [data, setData] = useState({});

  // Formの値を変更
  const handleChange = (event) => {
    // ...dataスプレッド構文で第1引数に入れることでプロパティのみを変更
    setData({ ...data, [event.target.name]: event.target.value });
  };

  // 取得（Show）※DOMを読み込んでから値を適用
  useEffect(() => {
    const fetchData = async () => {
      if (status.open) {
        await axios
        .get(`http://localhost:8000/api/manual/${status.id}`)
        .then((response) => {
          setData(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
      }
    };
    fetchData();
  }, [status]);

  return (
    <Dialog open={status.open} fullWidth maxWidth="lg">
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
        <Button
          onClick={() => {
            handleDialogPut(data);
            handleDialogClose();
            setData({});
          }}
          variant="contained"
          color="primary"
        >
          更新
        </Button>
        <Button
          onClick={() => {
            handleDialogClose();
            setData({});
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
