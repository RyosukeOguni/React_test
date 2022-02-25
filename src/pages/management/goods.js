import * as yup from "yup";
import ManagementBase from "../../components/templates/ManagementBase";

// ApiEndpoint
const endpoint = "goods";
// テーブル項目
const headCells = [
  {
    field: "id",
    type: "numeric",
    label: "ID",
  },
  {
    field: "goods_category",
    type: "text",
    label: "カテゴリ名",
    edit: {
      smSize: 12,
      required: true,
    },
  },
  {
    field: "is_active",
    type: "numeric",
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
// バリデーションルール
const schema = yup.object({
  goods_category: yup
    .string()
    .required("入力してください")
    .min(6, "6文字以上で入力してください")
    .max(255, "255文字以下で入力してください"),
});
/* 管理画面の共通テンプレート読込 */
const Goods = () => ManagementBase(endpoint, headCells, schema);
export default Goods;
