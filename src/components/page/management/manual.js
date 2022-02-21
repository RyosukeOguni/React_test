import React, { useState, useEffect, forwardRef } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import {
  Modal,
  Grid,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  TableRow,
  Paper,
  Typography,
  TextField,
  Checkbox,
  Button,
  IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import EnhancedTableHead from "./EnhancedTableHead";
import EnhancedTableToolbar from "./EnhancedTableToolbar";
import { restfulApiConfig } from "../../../config";

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

// statusを初期化
const initial = { open: false, obj: {}, type: "" };
// ApiEndpoint
const endpoint = "manual";
// テーブル項目
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

export default function Manual() {
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("calories");
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [rows, setRows] = useState([]);
  const [status, setStatus] = useState(initial);

  // 取得（Index）※DOMを読み込んでから値を適用
  useEffect(() => {
    const fetchData = async () => {
      await axios
        .get(restfulApiConfig.apiURL + endpoint)
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
      .get(restfulApiConfig.apiURL + endpoint + `/${id}`)
      .then((response) => {
        setStatus({ open: true, obj: response.data, type: "put" });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // 一覧表のstate変更とModalclose
  const handleDialogClose = ({ type, data }) => {
    if (type === "put") {
      const result = rows.map((row) => {
        return row.id === data.id ? data : row;
      });
      setRows(result);
    } else if (type === "post") {
      setRows([...rows, data]);
    }
    setStatus(initial);
  };

  // 削除（Delete）
  const selectDelete = async () => {
    const json = selected;
    !!json.length &&
      (await axios
        .post(restfulApiConfig.apiURL + endpoint + "/selectdelete", json)
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

  // TimeStamp型を日本の日付（年月日）に変換
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // モーダル内のコンポーネントにpropsする為にforwardRefする
  const RefModal = forwardRef(({ status, handleDialogClose }, ref) => {
    // RefModal という HOC を作成して ManualModal の forwardRef に ref を渡している
    return (
      <ManualModal
        status={status}
        handleDialogClose={handleDialogClose}
        forwardRef={ref}
      />
    );
  });

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
      <Modal open={status.open}>
        {/* 空要素でくくる事でエラーを解消 */}
        <>
          <RefModal status={status} handleDialogClose={handleDialogClose} />
        </>
      </Modal>
    </Box>
  );
}

const ManualModal = ({ status, handleDialogClose, forwardRef }) => {
  const { obj, type } = status;
  // Hook Formの設定
  const { register, handleSubmit } = useForm();

  // フォーム送信時の処理
  const onSubmit = (data) => {
    type === "post" ? dataPostApi(data) : dataPutApi(data);
  };

  // 登録（Post）
  const dataPostApi = async (data) => {
    // Objectをjson文字列に変換してjsonに変換
    const json = JSON.parse(JSON.stringify(data));
    await axios
      .post(restfulApiConfig.apiURL + endpoint, json)
      .then((response) => {
        handleDialogClose({ type: type, data: response.data });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // 更新（Put）
  const dataPutApi = async (data) => {
    // Objectをjson文字列に変換してjsonに変換
    const json = JSON.parse(JSON.stringify(data));
    await axios
      .put(restfulApiConfig.apiURL + endpoint + `/${obj.id}`, json)
      .then((response) => {
        handleDialogClose({ type: type, data: response.data });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <Box
      sx={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: 500,
        bgcolor: "background.paper",
        boxShadow: 24,
        p: 4,
      }}
      ref={forwardRef}
    >
      <Typography variant="h2">ID:{obj.id}</Typography>
      <Grid container spacing={1}>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="standard-basic"
            label="カテゴリID"
            {...register("goods_category_id")}
            type={"number"}
            defaultValue={
              obj.goods_category_id === undefined ? "" : obj.goods_category_id
            }
            margin="normal"
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="standard-basic"
            label="ブランドID"
            {...register("brand_id")}
            type={"number"}
            defaultValue={obj.brand_id === undefined ? "" : obj.brand_id}
            margin="normal"
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            id="standard-basic"
            label="商品名"
            {...register("goods_name")}
            type={"text"}
            defaultValue={obj.goods_name === undefined ? "" : obj.goods_name}
            margin="normal"
            fullWidth
          />
        </Grid>
      </Grid>
      <Button
        onClick={handleSubmit(onSubmit)}
        variant="contained"
        color="primary"
      >
        {(() => {
          if (type === "put") {
            return "更新";
          } else if (type === "post") {
            return "登録";
          }
        })()}
      </Button>
      <Button
        onClick={() => {
          handleDialogClose({ type: "" });
        }}
        color="primary"
      >
        キャンセル
      </Button>
    </Box>
  );
};
