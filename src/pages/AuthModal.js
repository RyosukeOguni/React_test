import * as React from "react";
import { Box, Typography } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import Modal from "@mui/material/Modal";
import { useSelector } from "react-redux";
import AuthInput from "./Auth";

export default function AuthModal() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const auth = useSelector((state) => state.auth);

  return (
    <div>
      <IconButton onClick={handleOpen} color="inherit">
        {auth.isAuth ? <LogoutIcon /> : <LoginIcon />}
      </IconButton>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 500,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 2,
          }}
        >
          <Typography component="h3" variant="h6">
            {auth.isAuth ? "ログアウト" : "ログイン"}
          </Typography>
          <AuthInput handleClose={handleClose} />
        </Box>
      </Modal>
    </div>
  );
}
