import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Checkbox from "@mui/material/Checkbox";
import axios from "axios";
import EnhancedTableHead from "./EnhancedTableHead";
import EnhancedTableToolbar from "./EnhancedTableToolbar";
import ManualDialog from "./manual_dialog";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

export default function Manual() {
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("calories");
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [rows, setRows] = useState([]);
  const [status, setStatus] = useState({ open: false, id: null });

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios("http://localhost:8000/api/manual");
      setRows(result.data);
    };
    fetchData();
  }, []);

  const handleDialogClose = () => {
    setStatus({ open: false });
  };

  const headCells = [
    {
      field: "id",
      numeric: false,
      disablePadding: true,
      label: "ID",
    },
    {
      field: "goods_category_id",
      numeric: false,
      disablePadding: false,
      label: "カテゴリID",
    },
    {
      field: "brand_id",
      numeric: false,
      disablePadding: false,
      label: "ブランドID",
    },
    {
      field: "goods_image",
      numeric: false,
      disablePadding: false,
      label: "画像",
    },
    {
      field: "goods_name",
      numeric: false,
      disablePadding: false,
      label: "商品名",
    },
    {
      field: "oroshi_price",
      numeric: true,
      disablePadding: false,
      label: "卸価格",
    },
    {
      field: "is_active",
      numeric: true,
      disablePadding: false,
      label: "状態",
    },
    {
      field: "created_at",
      numeric: false,
      disablePadding: false,
      label: "登録日",
    },
    {
      field: "updated_at",
      numeric: false,
      disablePadding: false,
      label: "更新日",
    },
  ];

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = rows.map((n) => n.id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = (id) => selected.indexOf(id) !== -1;

  return (
    <Box sx={{ width: "100%" }}>
      <Paper sx={{ width: "100%", mb: 2 }}>
        <TableContainer>
          <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
              headCells={headCells}
            />
            <TableBody>
              {stableSort(rows, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const isItemSelected = isSelected(row.id);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow hover tabIndex={-1} key={row.id}>
                      <TableCell
                        onClick={(event) => handleClick(event, row.id)}
                        padding="checkbox"
                      >
                        <Checkbox
                          color="primary"
                          checked={isItemSelected}
                          inputProps={{
                            "aria-labelledby": labelId,
                          }}
                        />
                      </TableCell>
                      <TableCell
                        onClick={(event) =>
                          setStatus({ open: true, id: row.id })
                        }
                      >
                        <IconButton
                          onClick={(event) =>
                            setStatus({ open: true, id: row.id })
                          }
                        >
                          <EditIcon color="primary" />
                        </IconButton>
                      </TableCell>
                      <TableCell
                        component="th"
                        id={labelId}
                        scope="row"
                        padding="none"
                      >
                        {row.id}
                      </TableCell>
                      <TableCell align="right">
                        {row.goods_category_id}
                      </TableCell>
                      <TableCell align="right">{row.brand_id}</TableCell>
                      <TableCell align="right">{row.goods_image}</TableCell>
                      <TableCell align="right">{row.goods_name}</TableCell>
                      <TableCell align="right">{row.oroshi_price}</TableCell>
                      <TableCell align="right">{row.is_active}</TableCell>
                      <TableCell align="right">{row.created_at}</TableCell>
                      <TableCell align="right">{row.updated_at}</TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
        <EnhancedTableToolbar numSelected={selected.length} />
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      <ManualDialog status={status} handleDialogClose={handleDialogClose} />
    </Box>
  );
}
