import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@material-ui/core";

const ManualDialog = ({ status, handleDialogClose }) => {
  // useState（）でstate変数とそのsetterを返す
  const [data, setData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      if (status.open) {
        const result = await axios(
          `http://localhost:8000/api/manual/${status.id}`
        );
        setData(result.data);
      }
    };
    fetchData();
  }, [status]);

  return (
    <Dialog open={status.open} fullWidth maxWidth="lg">
      <DialogTitle id="draggable-dialog-title">Detail</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Contact: {data.goods_category_id}
          <br />
          Contact: {data.brand_id}
          <br />
          Contact: {data.goods_name}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleDialogClose} color="primary">
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ManualDialog;
