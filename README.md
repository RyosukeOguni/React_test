# 管理システム

## １．React開発環境
-   create-react-app

## ２．使用ライブラリ
-   MUI関連
    -   @mui/material@5.4.1
    -   @mui/icons-material@5.4.1
-   CSSinJS
    -   @emotion/react@11.7.1
    -   @emotion/styled@11.6.0
-   SPAルーティング
    -   react-router-dom@6.2.1
-   State状態管理
    -   redux@4.1.2
    -   react-redux@7.2.6
-   redux永続化
    -   redux-persist@6.0.0
-   非同期通信
    -   axios@0.25.0
-   環境変数ファイル
    -   cross-env@7.0.3
-   Form用State(バリデーション付)
    -   react-hook-form@7.27.0
-   バリデーションライブラリ
    -   yup@0.32.11
-   react-hook-formでyupを有効化
    -   @hookform/resolvers@2.8.8

## ３．使用テンプレート
-   dachboardを部分的に使用<br>
https://github.com/mui/material-ui/tree/master/docs/data/material/getting-started/templates/dashboard


## ４．技術メモ

<details>
<summary><u>ステートフック（useState）</u></summary>

Vue.jsのdataにあたるもの

```
import React, { useState } from "react";
const [selected, setSelected] = useState([]);
setSlelcted(array);
```
---
</details>
<br>
<details>
<summary><u>副作用フック（useEffect）</u></summary>

Api通信などでDOM描画より遅れてdataを取得する場合、DOM描画後に要素に値を入れる

```
import React, { useEffect } from "react";
useEffect(() => {
  // メモリリークを防止
  let mounted = true;
  const fetchData = async () => {
    await axios
      .get(restfulApiConfig.apiURL + endpoint)
      .then((response) => {
       if (mounted) {
        setRows(response.data);
       }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  fetchData();
  return () => (mounted = false);
}, []);
```
-   Stateに値が渡される前にコンポーネントが削除された場合、メモリリークエラーが発生するので、通信中はStateに値を渡さない様にする
-   第2引数 []を空にすると、コンポーネント開始時に1回起動

---
<br>
同一コンポーネントが呼ばれて再描画されない状態の時、Tagの状態を初期化したい場合

```
import React, { useEffect } from "react";
const [value, setValue] = useState("manual");
const location = useLocation();
useEffect(() => {
  if (location.pathname === "/management") {
    setValue("manual");
  }
}, [location]);
```
-   managementでタグ状態を管理しているが、managementが再度Linkされた時に、タグ状態が初期値(manual)に戻らない現象を解消
-   第2引数 [location]が変更された場合、起動
---
</details>
<br>
<details>
<summary><u>Routerの階層化</u></summary>

Routerを階層（ネスト）して、下位リンクを作成する

```
//　親コンポーネント(Dashboard)
<Routes>
  <Route path="/" element={<Home />} />
  <Route path="management/*" element={<Management />} />
  <Route path="other1" element={<Other1 />} />
  <Route path="other2" element={<Other2 />} />
</Routes>

//　子コンポーネント(Management)
<Routes>
  <Route path="/*" element={<Manual />} />
  <Route path="goods" element={<Goods />} />
  <Route path="brand" element={<Brand />} />
</Routes>
//　※親で"management/*"が押下された時、path="/*"にリンクする

//　ナビタブ(Tablink)
<Tab value="manual" label="マニュアル管理" to="manual" component={Link} />
<Tab value="goods" label="商品管理" to="goods" component={Link} />
<Tab value="brand" label="ブランド名管理" to="brand" component={Link} />
//　※to="manual"の場合、path="/*"(その他)にリンクする
```
---
</details>
<br>
<details>
<summary><u>Table（選択、並び替え、ページネーション）</u></summary>

Sorting & selectingを加工<br>
https://mui.com/components/tables/

---
</details>
<br>
<details>
<summary><u>コンポーネント子要素の出力</u></summary>

子コンポーネントに親からコンポーネントを渡す（Vue.jsのslotにあたるもの）

```
//　親コンポーネント
<FncModal>
 <h1 className="Dialog-title" color="blue">Welcome</h1>
 <p className="Dialog-message">
  Thank you for visiting our spacecraft!
 </p>
</FncModal>

//　子コンポーネント
const FncModal = (props) => {
 return (
  <div className={props.color}> // 通常のprops渡し
   {props.children}　// childrenを使った要素渡し
  </div>
 );
}
```
---
</details>
<br>

## ５．作成者情報

-   作成者：小国亮介
