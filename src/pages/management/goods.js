import React, { useState, useEffect, forwardRef } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  Modal,
  Grid,
  Box,
  Typography,
  TextField,
  Button,
  DialogActions,
} from "@mui/material";
import EnhancedTable from "../../components/templates/EnhancedTable";
import {
  indexApi,
  showApi,
  deleteApi,
  postApi,
  putApi,
} from "../../components/modules/api";

// statusを初期化
const initial = { open: false, obj: {}, type: "" };
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
// バリデーションルール
const schema = yup.object({
  goods_category: yup
    .string()
    .required("入力してください")
    .min(6, "6文字以上で入力してください"),
});

export default function Manual() {
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
      <ManualModal
        status={status}
        handleDialogClose={handleDialogClose}
        forwardRef={ref}
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

const ManualModal = ({ status, handleDialogClose, forwardRef }) => {
  const { obj, type } = status;

  // Hook Formの設定※
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  // フォーム送信時の処理
  const onSubmit = (data) => {
    type === "post" ? dataPost(data) : dataPut(data);
  };

  // 登録（Post）
  const dataPost = async (data) => {
    postApi(data, endpoint, (data) => {
      handleDialogClose({ type: type, data: data });
    });
  };

  // 更新（Put）
  const dataPut = async (data) => {
    putApi(data, obj, endpoint, (data) => {
      handleDialogClose({ type: type, data: data });
    });
  };

  return (
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
      ref={forwardRef}
    >
      <Typography component="h3" variant="h6">
        {type === "post" ? "新規作成" : `ID:${obj.id}`}
      </Typography>
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
      <DialogActions>
        <Button
          onClick={handleSubmit(onSubmit)}
          variant="contained"
          color="primary"
        >
          {type === "put" ? "更新" : "登録"}
        </Button>
        <Button
          onClick={() => {
            handleDialogClose({ type: "" });
          }}
          color="primary"
        >
          キャンセル
        </Button>
      </DialogActions>
    </Box>
  );
};
