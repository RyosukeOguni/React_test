import * as React from "react";
import { Link } from "react-router-dom";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import HomeIcon from "@mui/icons-material/Home";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import { useSelector } from "react-redux";

const ListItems = () => {
  const auth = useSelector((state) => state.auth);

  // 管理画面リンク
  let management = null;
  // 認証済みの場合、管理画面リンクを表示
  if (auth.isAuth) {
    management = (
      <ListItemButton to="/management" component={Link}>
        <ListItemIcon>
          <DashboardIcon />
        </ListItemIcon>
        <ListItemText primary="管理画面" />
      </ListItemButton>
    );
  }

  return (
    <React.Fragment>
      <ListItemButton to="/" component={Link}>
        <ListItemIcon>
          <HomeIcon />
        </ListItemIcon>
        <ListItemText primary="HOME" />
      </ListItemButton>
      {management}
      <ListItemButton to="/other1" component={Link}>
        <ListItemIcon>
          <LibraryBooksIcon />
        </ListItemIcon>
        <ListItemText primary="その他１" />
      </ListItemButton>
      <ListItemButton to="/auth" component={Link}>
        <ListItemIcon>
          <PeopleIcon />
        </ListItemIcon>
        <ListItemText primary="認証" />
      </ListItemButton>
    </React.Fragment>
  );
};

export default ListItems;
