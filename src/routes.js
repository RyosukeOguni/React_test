import Manual from "./components/page/manual";
import Brand from "./components/page/brand";
import Goods from "./components/page/goods";

const routes = [
  { path: "/", component: Manual, exact: true },
  { path: "/brand", component: Brand },
  { path: "/goods", component: Goods },
];

export default routes;
