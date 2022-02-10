import React, { useState, useEffect } from "react";
import axios from "axios";
import MaterialTable from "material-table";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@material-ui/core";

const Manual = () => {
  // useState（）でstate変数とそのsetterを返す
  const [data, setData] = useState([]);
  const [status, setStatus] = React.useState({ open: false, rowData: {} });

  // domレンダリング後にaxiosを実行
  useEffect(() => {
    const fetchData = async () => {
      const result = await axios("http://localhost:8000/api/manual");
      setData(result.data);
    };
    fetchData();
  }, []);

  return (
    <div>
      <MaterialTable
        columns={[
          { title: "ID", field: "id", headerStyle: { whiteSpace: "nowrap" } },
          {
            title: "カテゴリID",
            field: "goods_category_id",
            headerStyle: { whiteSpace: "nowrap" },
          },
          {
            title: "ブランドID",
            field: "brand_id",
            headerStyle: { whiteSpace: "nowrap" },
          },
          {
            title: "画像",
            field: "goods_image",
            headerStyle: { whiteSpace: "nowrap" },
            cellStyle: {
              maxWidth: "200px",
              overflow: "hidden",
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
            },
          },
          {
            title: "商品名",
            field: "goods_name",
            headerStyle: { whiteSpace: "nowrap" },
          },
          {
            title: "卸価格",
            field: "oroshi_price",
            headerStyle: { whiteSpace: "nowrap" },
          },
          {
            title: "状態",
            field: "is_active",
            headerStyle: { whiteSpace: "nowrap" },
          },
          {
            title: "登録日",
            field: "created_at",
            type: "datetime",
            headerStyle: { whiteSpace: "nowrap" },
            cellStyle: {
              whiteSpace: "nowrap",
            },
          },
          {
            title: "更新日",
            field: "updated_at",
            type: "datetime",
            headerStyle: { whiteSpace: "nowrap" },
            cellStyle: {
              whiteSpace: "nowrap",
            },
          },
          {
            title: "削除日",
            field: "deleted_at",
            type: "datetime",
            headerStyle: { whiteSpace: "nowrap" },
            cellStyle: {
              whiteSpace: "nowrap",
            },
          },
        ]}
        data={data}
        options={{
          showTitle: false,
          sorting: true,
          selection: true,
          draggable: false,
        }}
        onRowClick={(event, rowData) => {
          event.preventDefault();

          setStatus({ open: true, rowData: rowData });
        }}
      />
      <Dialog
        open={status.open}
        fullWidth
        maxWidth="lg"
      >
        <DialogTitle id="draggable-dialog-title">Detail</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Contact: {status.rowData.goods_category_id}
            <br />
            Contact: {status.rowData.brand_id}
            <br />
            Contact: {status.rowData.goods_name}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setStatus({ open: false, rowData: status.rowData })}
            color="primary"
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Manual;
