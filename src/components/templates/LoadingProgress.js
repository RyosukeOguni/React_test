import React from "react";
import { Backdrop, CircularProgress } from "@mui/material";

const LoadingProgress = ({open}) => {
  return (
    <Backdrop open={open}>
    <CircularProgress color="inherit" />
  </Backdrop>  );
};

export default LoadingProgress;
