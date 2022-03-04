import React from "react";
import { Snackbar, Alert } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";

const CustomizedSnackbars = () => {
  const dispatch = useDispatch(); //action
  const access = useSelector((state) => state.access);
  const { open, type, message } = access;
  return (
    <Snackbar
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      open={open}
      autoHideDuration={3000}
      onClose={() =>
        dispatch({
          type: "HANDLE_CLOSE",
        })
      }
    >
      <Alert
        elevation={6}
        variant="filled"
        onClose={() =>
          dispatch({
            type: "HANDLE_CLOSE",
          })
        }
        severity={type}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default CustomizedSnackbars;
