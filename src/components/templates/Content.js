import React from "react";
import { Grid } from "@mui/material";
import { Routes, Route } from "react-router-dom";
import Manual from "../page/manual";
import Brand from "../page/brand";
import Goods from "../page/goods";

function Content() {
  return (
    <Grid container>
      <Grid sm={2} />
      <Grid lg={8} sm={8} spacing={10}>
        <Routes>
          <Route path="/" element={<Manual />} />
          <Route path="/goods" element={<Goods />} />
          <Route path="/brand" element={<Brand />} />
        </Routes>
      </Grid>
    </Grid>
  );
}
export default Content;
