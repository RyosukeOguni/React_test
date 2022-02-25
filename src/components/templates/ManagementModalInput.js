import * as React from "react";
import { Grid, TextField } from "@mui/material";

const ManagementModalInput = ({ register, obj, errors, headCells }) => {
  return (
    <Grid container spacing={1}>
      {headCells
        .filter((headCell) => {
          return !!headCell.edit;
        })
        .map((headCell) => (
          <Grid item xs={12} sm={headCell.edit.smSize} key={headCell.field}>
            <TextField
              id={headCell.field}
              label={headCell.label}
              type={headCell.type}
              {...register(headCell.field)}
              defaultValue={obj[headCell.field]}
              error={headCell.field in errors}
              helperText={errors[headCell.field]?.message}
              required={!!headCell.edit.required}
              margin="normal"
              fullWidth
            />
          </Grid>
        ))}
    </Grid>
  );
};

export default ManagementModalInput;
