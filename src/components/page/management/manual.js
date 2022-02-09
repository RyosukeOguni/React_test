import React, { useState, useEffect } from "react";
import axios from "axios";
import MaterialTable from "material-table";

const Manual = () => {
  // useState（）でstate変数とそのsetterを返す
  const [data, setData] = useState([]);

  // domレンダリング後にaxiosを実行
  useEffect(() => {
    const fetchData = async () => {
      const result = await axios("http://localhost:8000/api/manual");
      setData(result.data);
    };
    fetchData();
  }, []);

  return (
    <MaterialTable
      columns={[
        { title: "ID", field: "id" },
        { title: "商品カテゴリID", field: "goods_category_id" },
        { title: "ブランドID", field: "brand_id" },
        { title: "商品画像", field: "goods_image" },
        { title: "商品名", field: "goods_name" },
        { title: "卸し価格", field: "oroshi_price" },
        { title: "状態", field: "is_active" },
        { title: "登録日", field: "created_at" },
        { title: "更新日", field: "updated_at" },
        { title: "削除日", field: "deleted_at" },
      ]}
      data={data}
      options={{
        showTitle: false,
      }}
    />
  );
};

export default Manual;
