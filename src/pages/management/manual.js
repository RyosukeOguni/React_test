import React from "react";
import * as yup from "yup";
import { Grid, TextField } from "@mui/material";
import ManagementBase from "../../components/templates/ManagementBase";

// ApiEndpoint
const endpoint = "manual";
// テーブル項目
const headCells = [
  {
    field: "id",
    type: "numeric",
    label: "ID",
  },
  {
    field: "goods_category_id",
    type: "numeric",
    label: "カテゴリID",
  },
  {
    field: "brand_id",
    type: "numeric",
    label: "ブランドID",
  },
  {
    field: "goods_image",
    type: "text",
    label: "画像",
    sx: {
      maxWidth: "200px",
      overflow: "hidden",
      whiteSpace: "nowrap",
      textOverflow: "ellipsis",
    },
  },
  {
    field: "goods_name",
    type: "text",
    label: "商品名",
  },
  {
    field: "oroshi_price",
    type: "numeric",
    label: "卸価格",
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
          error={"goods_category_id" in errors}
          helperText={errors.goods_category_id?.message}
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
          error={"brand_id" in errors}
          helperText={errors.brand_id?.message}
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
          error={"goods_name" in errors}
          helperText={errors.goods_name?.message}
          fullWidth
        />
      </Grid>
    </Grid>
  );
};
// バリデーションルール
const schema = yup.object({
  goods_category_id: yup.string().required("入力してください"),
  brand_id: yup.string().required("入力してください"),
  goods_name: yup
    .string()
    .required("入力してください")
    .min(6, "6文字以上で入力してください"),
});

const Manual = () => ManagementBase(endpoint, headCells, schema, inputArea);

export default Manual;
