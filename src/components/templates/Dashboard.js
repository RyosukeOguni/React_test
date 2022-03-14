import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import {
  CssBaseline,
  Grid,
  Box,
  List,
  Drawer as MuiDrawer,
  AppBar as MuiAppBar,
  Toolbar,
  Container,
  Paper,
  Divider,
  Typography,
  IconButton,
} from "@mui/material";
import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ListItems from "./ListItems";
import Home from "../../pages/Home";
import Management from "../../pages/Management";
import Other1 from "../../pages/Other1";
import AuthModal from "./AuthModal";
import SnackBar from "./SnackBar";
import LoadingProgress from "./LoadingProgress";
import { useSelector, useDispatch } from "react-redux";
import axios from "../modules/config";

const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  "& .MuiDrawer-paper": {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: "border-box",
    ...(!open && {
      overflowX: "hidden",
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(7),
      [theme.breakpoints.up("sm")]: {
        width: theme.spacing(9),
      },
    }),
  },
}));

const mdTheme = createTheme();

function DashboardContent() {
  const [open, setOpen] = React.useState(false);
  const auth = useSelector((state) => state.auth);
  const access = useSelector((state) => state.access);
  const loading = useSelector((state) => state.loading);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const dispatch = useDispatch();
  // 取得（Index）※DOMを読み込んでから値を適用
  useEffect(() => {
    // ログイン時にCSRFトークンを初期化
    axios
      .get("api/admin")
      .then((res) => {
        dispatch({
          type: "GET_LOGIN_DATA",
          payload: { ...res.data.user }, // LOGINの場合、管理者情報をpayload
        });
      })
      .catch((error) => {
        dispatch({
          type: "GET_LOGOUT_DATA",
        });
      });
  }, [dispatch]);

  return (
    <ThemeProvider theme={mdTheme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar position="absolute" open={open}>
          <Toolbar
            sx={{
              pr: "24px", // keep right padding when drawer closed
            }}
          >
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={toggleDrawer}
              sx={{
                marginRight: "36px",
                ...(open && { display: "none" }),
              }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              component="h1"
              variant="h6"
              color="inherit"
              noWrap
              sx={{ flexGrow: 1 }}
            >
              SRL医療業務システム
            </Typography>
            <AuthModal />
          </Toolbar>
        </AppBar>
        <Drawer variant="permanent" open={open}>
          <Toolbar
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              px: [1],
            }}
          >
            <IconButton onClick={toggleDrawer}>
              <ChevronLeftIcon />
            </IconButton>
          </Toolbar>
          <Divider />
          <List component="nav">
            <ListItems />
          </List>
        </Drawer>
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === "light"
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            height: "100vh",
            overflow: "auto",
          }}
        >
          <Toolbar />
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
                  <Routes>
                    <Route path="/*" element={<Home />} />
                    {auth.isAuth && (
                      <Route path="management/*" element={<Management />} />
                    )}
                    <Route path="other1" element={<Other1 />} />
                  </Routes>
                </Paper>
              </Grid>
            </Grid>
          </Container>
        </Box>
      </Box>
      {access.open && <SnackBar />}
      {loading.progress && <LoadingProgress open={loading.progress} />}
    </ThemeProvider>
  );
}

export default function Dashboard() {
  return <DashboardContent />;
}
