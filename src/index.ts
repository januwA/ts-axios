// Test

import { axios } from "./axios";
import { CancelToken } from "./cancel-token";

// let cancel: (message?: string) => void;
// axios
//   .get<number[]>("http://localhost:3000", {
//     cancelToken: new CancelToken(_cancel => {
//       cancel = _cancel;
//     })
//   })
//   .then(r => {
//     console.log(r.data);
//   })
//   .catch(e => {
//     console.log(e);
//   });

// setTimeout(() => {
//   cancel("中断请求");
// }, 1000);

axios.interceptors.request.use(function (config) {
  console.log(config.url);
  return config;
});

axios.interceptors.response.use(function (r) {
  console.log(r.status);
  return r;
});

const source = CancelToken.source();
axios
  .get<number[]>("http://localhost:3000", {
    cancelToken: source.token
  })
  .then(r => {
    console.log(r.data);
  })
  .catch(e => {
    if (axios.isCancel(e)) {
      console.log(e.message);
    }
  });

setTimeout(() => {
  source.cancel("中断请求");
}, 1000);
