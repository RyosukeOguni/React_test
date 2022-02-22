import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  TableCell,
  TableRow,
  Checkbox,
  Paper,
  TableContainer,
  Table,
  TableBody,
  IconButton,
  TablePagination,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import EnhancedTableHead from "./EnhancedTableHead";
import EnhancedTableToolbar from "./EnhancedTableToolbar";

export default function EnhancedTable(props) {
  const { headCells, selected, setSelected, rows, selectDelete, dataShow } =
    props;

  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("calories");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

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

  // TimeStamp型を日本の日付（年月日）に変換
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("ja-JP", options);
  };

  return (
    <Paper sx={{ width: "100%", mb: 2 }}>
      <TableContainer>
        <Table sx={{ tableLayout: "auto" }} aria-labelledby="tableTitle">
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
                      onClick={(event) => {
                        dataShow(row.id);
                      }}
                    >
                      <IconButton>
                        <EditIcon color="primary" />
                      </IconButton>
                    </TableCell>

                    {headCells.map((headCell) => (
                      <TableCell
                        id={labelId}
                        key={headCell.field}
                        align={headCell.type === "numeric" ? "right" : "left"}
                        sx={
                          !!headCell.sx ? headCell.sx : { whiteSpace: "nowrap" }
                        }
                      >
                        {headCell.type === "timestamp"
                          ? formatDate(row[headCell.field])
                          : row[headCell.field]}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <EnhancedTableToolbar
        numSelected={selected.length}
        selectDelete={selectDelete}
      />
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
  );
}

EnhancedTable.propTypes = {
  dataShow: PropTypes.func.isRequired,
  selectDelete: PropTypes.func.isRequired,
  setSelected: PropTypes.func.isRequired,
  headCells: PropTypes.array.isRequired,
  rows: PropTypes.array.isRequired,
};
