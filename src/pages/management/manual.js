import * as yup from "yup";
import ManagementBase from "../../components/templates/ManagementBase";

/* ApiEndpoint */
const endpoint = "manual";

/*
テーブル項目
必須項目: {
  field: [フィールド名],
  type: [number,text,timestamp],
  label: [表示名],
},
オプション: {
  edit: {　※Form項目を生成
    smSize: [1～12]　※smサイズ時のGrid幅,
    required: [boolean]　※Formの必須項目,
  },
  sx: {　※cssを適用（defaultは{whiteSpace: "nowrap"}）
    [css]　※sx　props形式で入力
  },
}
*/
const headCells = [
  {
    field: "id",
    type: "number",
    label: "ID",
  },
  {
    field: "goods_category_id",
    type: "number",
    label: "カテゴリID",
    edit: {
      smSize: 6,
      required: false,
    },
  },
  {
    field: "brand_id",
    type: "number",
    label: "ブランドID",
    edit: {
      smSize: 6,
      required: true,
    },
  },
  {
    field: "goods_image",
    type: "text",
    label: "画像",
    sx: {
      maxWidth: "200px",
      overflow: "hidden",
      whiteSpace: "nowrap",
      textOverflow: "ellipsis",
    },
  },
  {
    field: "goods_name",
    type: "text",
    label: "商品名",
    edit: {
      smSize: 12,
      required: true,
    },
  },
  {
    field: "oroshi_price",
    type: "number",
    label: "卸価格",
    edit: {
      smSize: 12,
      required: true,
    },
  },
  {
    field: "is_active",
    type: "number",
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

/*　バリデーションルール　参照：https://github.com/jquense/yup　*/
const schema = yup.object({
  goods_category_id: yup
    .number()
    .typeError("数値で入力してください")
    .required("入力してください"),
  brand_id: yup
    .number()
    .typeError("数値で入力してください")
    .required("入力してください"),
  goods_name: yup
    .string()
    .required("入力してください")
    .min(6, "6文字以上で入力してください")
    .max(255, "255文字以下で入力してください"),
  oroshi_price: yup
    .number()
    .typeError("数値で入力してください")
    .required("入力してください"),
});

/* 管理画面の共通テンプレート読込 */
const Manual = () => ManagementBase(endpoint, headCells, schema);
export default Manual;
