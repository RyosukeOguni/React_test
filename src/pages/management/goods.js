import React from "react";
import * as yup from "yup";
import { Grid, TextField } from "@mui/material";
import ManagementBase from "../../components/templates/ManagementBase";

// ApiEndpoint
const endpoint = "goods";
// テーブル項目
const headCells = [
  {
    field: "id",
    type: "numeric",
    label: "ID",
  },
  {
    field: "goods_category",
    type: "text",
    label: "カテゴリ名",
  },
  {
    field: "is_active",
    type: "numeric",
    label: "状態",
  },
  {
    field: "created_at",
    type: "timestamp",
    label: "登録日",
  },
  {
    field: "updated_at",
    type: "timestamp",
    label: "更新日",
  },
];
// Modal編集項目
const inputArea = (register, obj, errors) => {
  return (
    <Grid container spacing={1}>
      <Grid item xs={12}>
        <TextField
          required
          id="standard-basic"
          label="カテゴリ名"
          {...register("goods_category")}
          type={"text"}
          defaultValue={
            obj.goods_category === undefined ? "" : obj.goods_category
          }
          margin="normal"
          error={"goods_category" in errors}
          helperText={errors.goods_category?.message}
          fullWidth
        />
      </Grid>
    </Grid>
  );
};
// バリデーションルール
const schema = yup.object({
  goods_category: yup
    .string()
    .required("入力してください")
    .min(6, "6文字以上で入力してください"),
});

const Goods = () => ManagementBase(endpoint, headCells, schema, inputArea);

export default Goods;
