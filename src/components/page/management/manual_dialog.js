import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  TextField,
} from "@material-ui/core";

const ManualDialog = ({ status, handleDialogClose }) => {
  // useStateでstate変数とそのsetterを返す（React Hooks）
  const [data, setData] = useState({});

  const handleChange = (event) => {
    // ...dataスプレッド構文で第1引数に入れることでプロパティのみを変更
    setData({ ...data, [event.target.name]: event.target.value });
  };

  // DOMを読み込んでから動作することで、
  useEffect(() => {
    const fetchData = async () => {
      if (status.open) {
        const result = await axios(
          `http://localhost:8000/api/manual/${status.id}`
        );
        setData(result.data);
      }
    };
    fetchData();
  }, [status]);

  return (
    <Dialog open={status.open} fullWidth maxWidth="lg">
      <DialogTitle id="draggable-dialog-title">Detail</DialogTitle>
      <DialogContent>
        <DialogContentText>
          <TextField
            required
            id="filled-category-id"
            label="カテゴリID"
            name={"goods_category_id"}
            value={data.goods_category_id === undefined ? "" : data.goods_category_id}
            variant="filled"
            onChange={handleChange}
          />
          <TextField
            required
            id="filled-brand-id"
            label="ブランドID"
            name={"brand_id"}
            value={data.brand_id === undefined ? "" : data.brand_id}
            variant="filled"
            onChange={handleChange}
          />
          <TextField
            required
            id="filled-goods-name"
            label="商品名"
            name={"goods_name"}
            value={data.goods_name === undefined ? "" : data.goods_name}
            variant="filled"
            onChange={handleChange}
          />
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            handleDialogClose();
            setData({});
          }}
          color="primary"
        >
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ManualDialog;
