import React, { useState, useEffect } from "react";
import * as yup from "yup";
import { Modal, Grid, Box, TextField, Button } from "@mui/material";
import EnhancedTable from "../../components/templates/EnhancedTable";
import ManagementModal from "../../components/templates/ManagementModal";
import { indexApi, showApi, deleteApi } from "../../components/modules/api";

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

// statusを初期化
const initial = { open: false, obj: {}, type: "" };

export default function Manual() {
  const [selected, setSelected] = useState([]);
  const [rows, setRows] = useState([]);
  const [status, setStatus] = useState(initial);

  // 取得（Index）※DOMを読み込んでから値を適用
  useEffect(() => {
    // メモリリークを防止
    let mounted = true;
    indexApi(endpoint, (response) => {
      if (mounted) {
        setRows(response.data);
      }
    });
    return () => (mounted = false);
  }, []);

  // 取得（Show）
  const dataShow = (id) => {
    showApi(id, endpoint, (data) => {
      setStatus({ open: true, obj: data, type: "put" });
    });
  };

  // 削除（Delete）
  const selectDelete = () => {
    deleteApi(selected, endpoint, () => {
      const result = rows.filter((row) => !selected.includes(row.id));
      setRows(result);
      setSelected([]);
    });
  };

  // 一覧表のstate変更とModalclose
  const handleDialogClose = ({ type, data }) => {
    if (type === "put") {
      const result = rows.map((row) => {
        return row.id === data.id ? data : row;
      });
      setRows(result);
    } else if (type === "post") {
      setRows([...rows, data]);
    }
    setStatus(initial);
  };

  return (
    <Box sx={{ width: "100%", position: "relative" }}>
      <Button
        sx={{ position: "absolute", right: 10, top: -30 }}
        onClick={() => {
          setStatus({ open: true, obj: {}, type: "post" });
        }}
        variant="contained"
        color="primary"
      >
        新規作成
      </Button>
      <EnhancedTable
        headCells={headCells}
        selected={selected}
        setSelected={setSelected}
        rows={rows}
        selectDelete={selectDelete}
        dataShow={dataShow}
      />
      <Modal open={status.open}>
        {/* Mui:Modal直下に自作コンポーネントを入れるとerrorが発生する */}
        {/* 空要素で括る事でerrorを解消 */}
        <>
          <ManagementModal
            status={status}
            handleDialogClose={handleDialogClose}
            endpoint={endpoint}
            schema={schema}
          >
            {/* Modalコンポーネントにchildrenで要素を渡す*/}
            {inputArea}
          </ManagementModal>
        </>
      </Modal>
    </Box>
  );
}
