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
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import axios from "axios";
import EnhancedTableHead from "./EnhancedTableHead";
import EnhancedTableToolbar from "./EnhancedTableToolbar";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import ManualModal from "./manual_modal";

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

const initial = { open: false, obj: {}, type: "" };

export default function Manual() {
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("calories");
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [rows, setRows] = useState([]);
  const [status, setStatus] = useState(initial);

  // 取得（Index）※DOMを読み込んでから値を適用
  useEffect(() => {
    const fetchData = async () => {
      await axios
        .get("http://localhost:8000/api/manual")
        .then((response) => {
          setRows(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    };
    fetchData();
  }, []);

  // 取得（Show）
  const showApi = async (id) => {
    await axios
      .get(`http://localhost:8000/api/manual/${id}`)
      .then((response) => {
        setStatus({ open: true, obj: response.data, type: "put" });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // 一覧表のstate変更とDialogのclose
  const handleDialogClose = ({ type, data }) => {
    if (type === "put") {
      const result = rows.map((row) => {
        return row.id === data.id ? data : row;
      });
      setRows(result);
      setStatus(initial);
    } else if (type === "post") {
      setRows([...rows, data]);
      setStatus(initial);
    } else {
      setStatus(initial);
    }
  };

  // 削除（Delete）
  const selectDelete = async () => {
    const json = selected;
    !!json.length &&
      (await axios
        .post("http://localhost:8000/api/manual/selectdelete", json)
        .then((response) => {
          console.log(response);
          alert("ID:" + json + "を削除しました");
          const result = rows.filter((row) => !selected.includes(row.id));
          setRows(result);
          setSelected([]);
        })
        .catch((error) => {
          console.log(error);
        }));
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

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const body = (
    <ManualModal status={status} handleDialogClose={handleDialogClose} />
  );

  return (
    <Box sx={{ width: "100%", position: "relative" }}>
      <Button
        sx={{ position: "absolute", right: 10, top: -30 }}
        onClick={() => {
          setStatus({ open: true, obj: {}, type: "post" });
        }}
        variant="contained"
        color="primary"
      >
        新規作成
      </Button>
      <Paper sx={{ width: "100%", mb: 2 }}>
        <TableContainer>
          <Table
            sx={{ minWidth: 750, tableLayout: "fixed" }}
            aria-labelledby="tableTitle"
          >
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
                          showApi(row.id);
                        }}
                      >
                        <IconButton>
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
                      <TableCell
                        align="left"
                        sx={{
                          overflow: "hidden",
                          whiteSpace: "nowrap",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {row.goods_image}
                      </TableCell>
                      <TableCell align="left">{row.goods_name}</TableCell>
                      <TableCell align="right">{row.oroshi_price}</TableCell>
                      <TableCell align="right">{row.is_active}</TableCell>
                      <TableCell align="left">
                        {formatDate(row.created_at)}
                      </TableCell>
                      <TableCell align="left">
                        {formatDate(row.updated_at)}
                      </TableCell>
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

      <Modal open={status.open}>{body}</Modal>
    </Box>
  );
}
