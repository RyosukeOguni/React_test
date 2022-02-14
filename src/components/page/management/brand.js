import React, { useState, useEffect } from "react";
import axios from "axios";
import MaterialTable from "material-table";

const Brand = () => {
  // useState（）でstate変数とそのsetterを返す
  const [data, setData] = useState([]);

  // domレンダリング後にaxiosを実行
  useEffect(() => {
    const fetchData = async () => {
      const result = await axios.get("http://localhost:8000/api/brand");
      setData(result.data);
    };
    fetchData();
  }, []);

  return (
    <MaterialTable
      columns={[
        { title: "ID", field: "id" },
        {
          title: "管理ID",
          field: "abbreviation",
          headerStyle: { whiteSpace: "nowrap" },
        },
        {
          title: "ブランド名",
          field: "brand_name",
          headerStyle: { whiteSpace: "nowrap" },
        },
        {
          title: "ブランド名（jp）",
          field: "brand_name_jp",
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
          field: "delete_at",
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
      }}
    />
  );
};

export default Brand;
