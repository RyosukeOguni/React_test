import * as React from "react";
import { Modal, IconButton } from "@mui/material";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import { useSelector } from "react-redux";
import AuthModalInput from "./AuthModalInput";

export default function AuthModal() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const auth = useSelector((state) => state.auth);

  return (
    <>
      <IconButton onClick={handleOpen} color="inherit">
        {auth.isAuth ? <LogoutIcon /> : <LoginIcon />}
      </IconButton>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <>
          <AuthModalInput handleClose={handleClose} />
        </>
      </Modal>
    </>
  );
}
