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
  DialogActions,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import EnhancedTableHead from "../../components/templates/EnhancedTableHead";
import EnhancedTableToolbar from "../../components/templates/EnhancedTableToolbar";
import { restfulApiConfig } from "../../components/modules/config";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

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

// statusを初期化
const initial = { open: false, obj: {}, type: "" };
// ApiEndpoint
const endpoint = "brand";
// テーブル項目
const headCells = [
  {
    field: "id",
    type: "numeric",
    label: "ID",
  },
  {
    field: "abbreviation",
    type: "text",
    label: "管理ID",
  },
  {
    field: "brand_name",
    type: "text",
    label: "ブランド名",
  },
  {
    field: "brand_name_jp",
    type: "text",
    label: "ブランド名（jp）",
  },
  {
    field: "is_active",
    type: "numeric",
    label: "状態",
  },
  {
    field: "created_at",
    type: "timestamp",
    label: "登録日",
  },
  {
    field: "updated_at",
    type: "timestamp",
    label: "更新日",
  },
];
// バリデーションルール
const schema = yup.object({
  abbreviation: yup.string().required("入力してください"),
  brand_name: yup.string().required("入力してください"),
  brand_name_jp: yup
    .string()
    .required("入力してください")
    .min(6, "6文字以上で入力してください"),
});

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
    // メモリリークを防止
    let mounted = true;
    const fetchData = async () => {
      await axios
        .get(restfulApiConfig.apiURL + endpoint)
        .then((response) => {
          if (mounted) {
            setRows(response.data);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    };
    fetchData();
    return () => (mounted = false);
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
                          showApi(row.id);
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
                            !!headCell.sx
                              ? headCell.sx
                              : { whiteSpace: "nowrap" }
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

  // Hook Formの設定※
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  // フォーム送信時の処理
  const onSubmit = (data) => {
    type === "post" ? dataPostApi(data) : dataPutApi(data);
  };

  // 登録（Post）
  const dataPostApi = async (data) => {
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
        p: 2,
      }}
      ref={forwardRef}
    >
      <Typography component="h3" variant="h6">
        {type === "post" ? "新規作成" : `ID:${obj.id}`}
      </Typography>
      <Grid container spacing={1}>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="standard-basic"
            label="管理ID"
            {...register("abbreviation")}
            type={"text"}
            defaultValue={
              obj.abbreviation === undefined ? "" : obj.abbreviation
            }
            margin="normal"
            error={"abbreviation" in errors}
            helperText={errors.abbreviation?.message}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="standard-basic"
            label="ブランドID"
            {...register("brand_name")}
            type={"text"}
            defaultValue={obj.brand_name === undefined ? "" : obj.brand_name}
            margin="normal"
            error={"brand_name" in errors}
            helperText={errors.brand_name?.message}
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            id="standard-basic"
            label="ブランド名（jp）"
            {...register("brand_name_jp")}
            type={"text"}
            defaultValue={
              obj.brand_name_jp === undefined ? "" : obj.brand_name_jp
            }
            margin="normal"
            error={"brand_name_jp" in errors}
            helperText={errors.brand_name_jp?.message}
            fullWidth
          />
        </Grid>
      </Grid>
      <DialogActions>
        <Button
          onClick={handleSubmit(onSubmit)}
          variant="contained"
          color="primary"
        >
          {type === "put" ? "更新" : "登録"}
        </Button>
        <Button
          onClick={() => {
            handleDialogClose({ type: "" });
          }}
          color="primary"
        >
          キャンセル
        </Button>
      </DialogActions>
    </Box>
  );
};
