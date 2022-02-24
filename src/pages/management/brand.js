import React, { useState, useEffect, forwardRef } from "react";
import * as yup from "yup";
import { Modal, Grid, Box, TextField, Button } from "@mui/material";
import EnhancedTable from "../../components/templates/EnhancedTable";
import ManagementModal from "../../components/templates/ManagementModal";
import { indexApi, showApi, deleteApi } from "../../components/modules/api";

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

// statusを初期化
const initial = { open: false, obj: {}, type: "" };

export default function Brand() {
  const [selected, setSelected] = useState([]);
  const [rows, setRows] = useState([]);
  const [status, setStatus] = useState(initial);

  // 取得（Index）※DOMを読み込んでから値を適用
  useEffect(() => {
    indexApi(endpoint, setRows);
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

  // モーダル内のコンポーネントにpropsする為にforwardRefする
  const RefModal = forwardRef(({ status, handleDialogClose }, ref) => {
    // RefModal という HOC を作成して ManualModal の forwardRef に ref を渡している
    return (
      <ManagementModal
        status={status}
        handleDialogClose={handleDialogClose}
        forwardRef={ref}
        endpoint={endpoint}
        schema={schema}
        inputArea={inputArea}
      />
    );
  });

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
        {/* 空要素でくくる事でエラーを解消 */}
        <>
          <RefModal status={status} handleDialogClose={handleDialogClose} />
        </>
      </Modal>
    </Box>
  );
}
