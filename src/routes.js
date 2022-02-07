import Manual from "./page/manual";
import Brand from "./page/brand";
import Goods from "./page/goods";

const routes = [
  { path: "/", component: Manual, exact: true },
  { path: "/brand", component: Brand },
  { path: "/goods", component: Goods },
];

export default routes;
