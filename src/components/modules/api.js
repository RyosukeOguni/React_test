import axios from "./config";

// 取得（Index）※DOMを読み込んでから値を適用
export const indexApi = async (endpoint, callback, callback2) => {
  await axios
    .get(`api/${endpoint}`)
    .then((response) => {
      callback(response);
    })
    .catch((error) => {
      console.log(error);
      callback2();
    });
};

// 取得（Show）
export const showApi = async (id, endpoint, callback) => {
  await axios
    .get(`api/${endpoint}/${id}`)
    .then((response) => {
      callback(response);
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
      .post(`api/${endpoint}/selectdelete`, json)
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
    .post(`api/${endpoint}`, json)
    .then((response) => {
      callback(response);
    })
    .catch((error) => {
      console.log(error);
    });
};

// 更新（Put）
export const putApi = async (data, obj, endpoint, callback) => {
  const json = JSON.parse(JSON.stringify(data));
  await axios
    .put(`api/${endpoint}/${obj.id}`, json)
    .then((response) => {
      callback(response);
    })
    .catch((error) => {
      console.log(error);
    });
};
