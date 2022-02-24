import * as React from "react";
import { Box, Button, Typography, DialogActions } from "@mui/material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { postApi, putApi } from "../../components/modules/api";

const ManagementModal = ({
  status,
  handleDialogClose,
  endpoint,
  schema,
  children,
}) => {
  const { obj, type } = status;

  // Hook Formの設定
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
    >
      <Typography component="h3" variant="h6">
        {type === "post" ? "新規作成" : `ID:${obj.id}`}
      </Typography>
      {/* childrenで入れ子要素を取得 */}
      {children(register, obj, errors)}
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

export default ManagementModal;
