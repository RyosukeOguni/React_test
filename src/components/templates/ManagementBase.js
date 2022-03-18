import React, { useState, useLayoutEffect } from "react";
import { Modal, Box, Button } from "@mui/material";
import EnhancedTable from "./EnhancedTable";
import ManagementModal from "./ManagementModal";
import { indexApi, showApi, deleteApi } from "../modules/api";
import { useDispatch } from "react-redux";

export default function ManagementBase(endpoint, headCells, schema) {
  // status初期化
  const initial = { open: false, obj: {}, type: "" };
  const [selected, setSelected] = useState([]);
  const [rows, setRows] = useState([]);
  const [status, setStatus] = useState(initial);

  const dispatch = useDispatch(); //action

  // 取得（Index）※DOMを読み込んでから値を適用
  useLayoutEffect(() => {
    // メモリリークを防止
    let mounted = true;
    (async () => {
      await dispatch({
        type: "REQUEST_FETCH_DATA",
      });
      await indexApi(
        endpoint,
        (response) => {
          if (mounted) {
            setRows(response.data.data.map((data) => data.attribute));
          }
        },
        () => {
          dispatch({
            type: "GET_LOGOUT_DATA",
          });
        }
      );
      await dispatch({
        type: "SUCCESS_FETCH_DATA",
      });
    })();
    return () => (mounted = false);
  }, [dispatch, endpoint]);

  // 取得（Show）
  const dataShow = async (id) => {
    await dispatch({
      type: "REQUEST_FETCH_DATA",
    });
    await showApi(id, endpoint, (response) => {
      setStatus({ open: true, obj: response.data.data.attribute, type: "put" });
      dispatch({
        type: "SUCCESS_FETCH_DATA",
      });
    });
  };

  // 削除（Delete）
  const selectDelete = async () => {
    await dispatch({
      type: "REQUEST_FETCH_DATA",
    });
    await deleteApi(selected, endpoint, () => {
      const result = rows.filter((row) => !selected.includes(row.id));
      setRows(result);
      setSelected([]);
      dispatch({
        type: "SUCCESS_FETCH_DATA",
      });
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

  return (
    <Box sx={{ width: "100%", position: "relative" }}>
      <Button
        sx={{ position: "absolute", right: 10, top: -50 }}
        onClick={() => {
          setStatus({ open: true, obj: {}, type: "post" });
        }}
        variant="contained"
        color="primary"
      >
        新規作成
      </Button>
      <EnhancedTable
        headCells={headCells}
        selected={selected}
        setSelected={setSelected}
        rows={rows}
        selectDelete={selectDelete}
        dataShow={dataShow}
      />
      <Modal open={status.open}>
        {/* Mui:Modal直下に自作コンポーネントを入れるとerrorが発生する */}
        {/* 空要素で括る事でerrorを解消 */}
        <>
          <ManagementModal
            status={status}
            handleDialogClose={handleDialogClose}
            endpoint={endpoint}
            schema={schema}
            headCells={headCells}
          />
        </>
      </Modal>
    </Box>
  );
}
