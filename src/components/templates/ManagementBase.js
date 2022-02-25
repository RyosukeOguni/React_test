import React, { useState, useEffect } from "react";
import { Modal, Box, Button } from "@mui/material";
import EnhancedTable from "./EnhancedTable";
import ManagementModal from "./ManagementModal";
import { indexApi, showApi, deleteApi } from "../modules/api";

export default function Management(endpoint, headCells, schema) {
  // status初期化
  const initial = { open: false, obj: {}, type: "" };
  const [selected, setSelected] = useState([]);
  const [rows, setRows] = useState([]);
  const [status, setStatus] = useState(initial);

  // 取得（Index）※DOMを読み込んでから値を適用
  useEffect(() => {
    // メモリリークを防止
    let mounted = true;
    indexApi(endpoint, (response) => {
      if (mounted) {
        setRows(response.data);
      }
    });
    return () => (mounted = false);
  }, [endpoint]);

  // 取得（Show）
  const dataShow = (id) => {
    showApi(id, endpoint, (data) => {
      setStatus({ open: true, obj: data, type: "put" });
    });
  };

  // 削除（Delete）
  const selectDelete = () => {
    deleteApi(selected, endpoint, () => {
      const result = rows.filter((row) => !selected.includes(row.id));
      setRows(result);
      setSelected([]);
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
        sx={{ position: "absolute", right: 10, top: -30 }}
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
