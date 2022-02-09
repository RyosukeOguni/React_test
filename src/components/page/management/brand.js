import React, { useState, useEffect } from "react";
import axios from "axios";
import MaterialTable from "material-table";

const Brand = () => {
  // useState（）でstate変数とそのsetterを返す
  const [data, setData] = useState([]);

  // domレンダリング後にaxiosを実行
  useEffect(() => {
    const fetchData = async () => {
      const result = await axios("http://localhost:8000/api/brand");
      setData(result.data);
    };
    fetchData();
  }, []);

  return (
    <MaterialTable
      columns={[
        { title: "ID", field: "id" },
        { title: "管理ID", field: "abbreviation" },
        { title: "ブランド名", field: "brand_name" },
        { title: "ブランド名（日本語）", field: "brand_name_jp" },
        { title: "状態", field: "is_active" },
        { title: "登録日", field: "created_at" },
        { title: "更新日", field: "updated_at" },
        { title: "削除日", field: "delete_at" },
      ]}
      data={data}
      options={{
        showTitle: false,
      }}
    />
  );
};

export default Brand;
