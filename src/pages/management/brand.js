import React from "react";
import * as yup from "yup";
import { Grid, TextField } from "@mui/material";
import ManagementBase from "../../components/templates/ManagementBase";

// ApiEndpoint
const endpoint = "brand";
// テーブル項目
const headCells = [
  {
    field: "id",
    type: "numeric",
    label: "ID",
  },
  {
    field: "abbreviation",
    type: "text",
    label: "管理ID",
  },
  {
    field: "brand_name",
    type: "text",
    label: "ブランド名",
  },
  {
    field: "brand_name_jp",
    type: "text",
    label: "ブランド名（jp）",
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
          label="管理ID"
          {...register("abbreviation")}
          type={"text"}
          defaultValue={obj.abbreviation === undefined ? "" : obj.abbreviation}
          margin="normal"
          error={"abbreviation" in errors}
          helperText={errors.abbreviation?.message}
          fullWidth
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          required
          id="standard-basic"
          label="ブランドID"
          {...register("brand_name")}
          type={"text"}
          defaultValue={obj.brand_name === undefined ? "" : obj.brand_name}
          margin="normal"
          error={"brand_name" in errors}
          helperText={errors.brand_name?.message}
          fullWidth
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          required
          id="standard-basic"
          label="ブランド名（jp）"
          {...register("brand_name_jp")}
          type={"text"}
          defaultValue={
            obj.brand_name_jp === undefined ? "" : obj.brand_name_jp
          }
          margin="normal"
          error={"brand_name_jp" in errors}
          helperText={errors.brand_name_jp?.message}
          fullWidth
        />
      </Grid>
    </Grid>
  );
};
// バリデーションルール
const schema = yup.object({
  abbreviation: yup.string().required("入力してください"),
  brand_name: yup.string().required("入力してください"),
  brand_name_jp: yup
    .string()
    .required("入力してください")
    .min(6, "6文字以上で入力してください"),
});

const Brand = () => ManagementBase(endpoint, headCells, schema, inputArea);

export default Brand;
