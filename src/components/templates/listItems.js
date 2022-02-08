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
    <ListItemButton to="/" component={Link}>
      <ListItemIcon>
        <DashboardIcon />
      </ListItemIcon>
      <ListItemText primary="管理画面"  />
    </ListItemButton>
    <ListItemButton  to="/other1" component={Link}>
      <ListItemIcon>
        <ShoppingCartIcon />
      </ListItemIcon>
      <ListItemText primary="その他１" />
    </ListItemButton>
    <ListItemButton to="/other2" component={Link} >
      <ListItemIcon>
        <LayersIcon />
      </ListItemIcon>
      <ListItemText primary="その他２" />
    </ListItemButton>
  </React.Fragment>
);

