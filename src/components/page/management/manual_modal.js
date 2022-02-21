import React from "react";
import axios from "axios";
import { Button, TextField, Box, Grid, Typography } from "@mui/material";
import { useForm } from "react-hook-form";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 2,
};

const ManualModal = ({ status, handleDialogClose, forwardRef }) => {
  // propsの値を分割代入
  const { obj, type } = status;

  const { register, handleSubmit } = useForm();

  // フォーム送信時の処理
  const onSubmit = (data) => {
    type === "post" ? dataPostApi(data) : dataPutApi(data);
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
      .put(`http://localhost:8000/api/manual/${obj.id}`, json)
      .then((response) => {
        handleDialogClose({ type: type, data: response.data });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <Box sx={style} ref={forwardRef}>
      <Typography variant="h2">ID:{obj.id}</Typography>
      <Grid container spacing={1}>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="standard-basic"
            label="カテゴリID"
            {...register("goods_category_id")}
            type={"number"}
            defaultValue={
              obj.goods_category_id === undefined ? "" : obj.goods_category_id
            }
            margin="normal"
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="standard-basic"
            label="ブランドID"
            {...register("brand_id")}
            type={"number"}
            defaultValue={obj.brand_id === undefined ? "" : obj.brand_id}
            margin="normal"
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            id="standard-basic"
            label="商品名"
            {...register("goods_name")}
            type={"text"}
            defaultValue={obj.goods_name === undefined ? "" : obj.goods_name}
            margin="normal"
            fullWidth
          />
        </Grid>
      </Grid>
      <Button
        onClick={handleSubmit(onSubmit)}
        variant="contained"
        color="primary"
      >
        {(() => {
          if (type === "put") {
            return "更新";
          } else if (type === "post") {
            return "登録";
          }
        })()}
      </Button>
      <Button
        onClick={() => {
          handleDialogClose({ type: "" });
        }}
        color="primary"
      >
        キャンセル
      </Button>
    </Box>
  );
};

export default ManualModal;
