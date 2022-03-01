import * as React from "react";
import { Link } from "react-router-dom";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import HomeIcon from "@mui/icons-material/Home";
import DashboardIcon from "@mui/icons-material/Dashboard";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import { useSelector } from "react-redux";

const ListItems = () => {
  const auth = useSelector((state) => state.auth);

  return (
    <React.Fragment>
      <ListItemButton to="/" component={Link}>
        <ListItemIcon>
          <HomeIcon />
        </ListItemIcon>
        <ListItemText primary="HOME" />
      </ListItemButton>
      {auth.isAuth && (
        <ListItemButton to="/management" component={Link}>
          <ListItemIcon>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText primary="管理画面" />
        </ListItemButton>
      )}
      <ListItemButton to="/other1" component={Link}>
        <ListItemIcon>
          <LibraryBooksIcon />
        </ListItemIcon>
        <ListItemText primary="その他１" />
      </ListItemButton>
    </React.Fragment>
  );
};

export default ListItems;
