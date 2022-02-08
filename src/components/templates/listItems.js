import * as React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LayersIcon from '@mui/icons-material/Layers';
import { Link } from 'react-router-dom'

export const mainListItems = (
  <React.Fragment>
    <Link to="/">
    <ListItemButton>
      <ListItemIcon>
        <DashboardIcon />
      </ListItemIcon>
      <ListItemText primary="マニュアル管理" />
    </ListItemButton>
    </Link>
    <Link to="/goods">
    <ListItemButton>
      <ListItemIcon>
        <ShoppingCartIcon />
      </ListItemIcon>
      <ListItemText primary="商品管理" />
    </ListItemButton>
    </Link>
    <Link to="/brand">
    <ListItemButton>
      <ListItemIcon>
        <LayersIcon />
      </ListItemIcon>
      <ListItemText primary="ブランド名管理" />
    </ListItemButton>
    </Link>
  </React.Fragment>
);

