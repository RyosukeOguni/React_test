import React from "react";
import { AppBar, Toolbar } from "@material-ui/core";

const Header = () => {
  return (
    <AppBar position="static" style={{ backgroundColor: "#4169e1" }}>
      <Toolbar>管理画面</Toolbar>
    </AppBar>
  );
};

export default Header;
