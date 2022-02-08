import React from "react";
import { Grid } from "@mui/material";
import { Routes, Route } from "react-router-dom";
import Tablink from "../templates/Tablink";
import Manual from "../page/management/manual";
import Brand from "../page/management/brand";
import Goods from "../page/management/goods";

class Management extends React.Component {
  render() {
    return (
      <Grid item xs={12}>
          <Tablink />
          <Routes>
            <Route path="/" element={<Manual />} />
            <Route path="goods" element={<Goods />} />
            <Route path="brand" element={<Brand />} />
          </Routes>
      </Grid>
    );
  }
}

export default Management;
