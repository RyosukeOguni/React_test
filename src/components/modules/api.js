import { restfulApiConfig } from "./config";
import axios from "axios";

// 取得（Index）※DOMを読み込んでから値を適用
export const indexApi = (endpoint, setRows) => {
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
};

// 取得（Show）
export const showApi = async (id, endpoint, callback) => {
  await axios
    .get(restfulApiConfig.apiURL + endpoint + `/${id}`)
    .then((response) => {
      callback(response.data);
    })
    .catch((error) => {
      console.log(error);
    });
};

// 削除（Delete）
export const deleteApi = async (selected, endpoint, callback) => {
  const json = selected;
  !!json.length &&
    (await axios
      .post(restfulApiConfig.apiURL + endpoint + "/selectdelete", json)
      .then((response) => {
        alert("ID:" + json + "を削除しました");
        callback();
      })
      .catch((error) => {
        console.log(error);
      }));
};

// 登録（Post）
export const postApi = async (data, endpoint, callback) => {
  const json = JSON.parse(JSON.stringify(data));
  await axios
    .post(restfulApiConfig.apiURL + endpoint, json)
    .then((response) => {
      callback(response.data);
    })
    .catch((error) => {
      console.log(error);
    });
};

// 更新（Put）
export const putApi = async (data, obj, endpoint, callback) => {
  const json = JSON.parse(JSON.stringify(data));
  await axios
    .put(restfulApiConfig.apiURL + endpoint + `/${obj.id}`, json)
    .then((response) => {
      callback(response.data);
    })
    .catch((error) => {
      console.log(error);
    });
};
