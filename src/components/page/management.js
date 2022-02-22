import React, { useState, useEffect } from "react";
import { Grid } from "@mui/material";
import { Routes, Route, useLocation } from "react-router-dom";
import Tablink from "../templates/Tablink";
import Manual from "../page/management/manual";
import Brand from "../page/management/brand";
import Goods from "../page/management/goods";

const Management = () => {
  const [value, setValue] = useState("manual");

  // pathが"/management"の場合、Tabのチェック状態を"manual"に戻す
  // ※サイドバーからLinkの場合、Tab状態が戻らない箇所を修正
  const location = useLocation();
  useEffect(() => {
    if (location.pathname === "/management") {
      setValue("manual");
    }
  }, [location]);
  
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Grid item xs={12}>
      <Tablink value={value} handleChange={handleChange} />
      <Routes>
        <Route path="/*" element={<Manual />} />
        <Route path="goods" element={<Goods />} />
        <Route path="brand" element={<Brand />} />
      </Routes>
    </Grid>
  );
};

export default Management;
