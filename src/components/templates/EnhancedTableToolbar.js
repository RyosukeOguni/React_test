import * as React from "react";
import PropTypes from "prop-types";
import { alpha } from "@mui/material/styles";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import DeleteIcon from "@mui/icons-material/Delete";

export default function EnhancedTableToolbar(props) {
  const { numSelected, selectDelete } = props;

  return numSelected > 0 ? (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(
              theme.palette.primary.main,
              theme.palette.action.activatedOpacity
            ),
        }),
      }}
    >
      <Typography
        sx={{ flex: "1 1 100%" }}
        color="inherit"
        variant="subtitle1"
        component="div"
      >
        {numSelected} selected
      </Typography>
      <Tooltip title="Delete">
        <IconButton onClick={selectDelete}>
          <DeleteIcon />
        </IconButton>
      </Tooltip>
    </Toolbar>
  ) : (
    ""
  );
}

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};
