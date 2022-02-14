import React, { useState, useEffect } from "react";
import axios from "axios";
import ManualDialog from "./manual_dialog";
import { DataGrid } from "@mui/x-data-grid";

const Goods = () => {
  // useState（）でstate変数とそのsetterを返す
  const [data, setData] = useState([]);
  const [status, setStatus] = useState({ open: false, id: null });

  // domレンダリング後にaxiosを実行
  useEffect(() => {
    const fetchData = async () => {
      const result = await axios("http://localhost:8000/api/goods");
      setData(result.data);
    };
    fetchData();
  }, []);

  const handleDialogClose = () => {
    setStatus({ open: false });
  };

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "goods_category", headerName: "カテゴリ名", width: 130 },
    { field: "is_active", headerName: "状態", width: 130 },
    {
      field: "created_at",
      headerName: "登録日",
      width: 90,
    },
    {
      field: "updated_at",
      headerName: "更新日",
      width: 90,
    },
    {
      field: "deleted_at",
      headerName: "削除日",
      width: 90,
    },
  ];

  return (
    <div style={{ height: 400, width: "100%" }}>
      <DataGrid
        rows={data}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        checkboxSelection
      />
      <ManualDialog status={status} handleDialogClose={handleDialogClose} />
    </div>
  );
};

export default Goods;
