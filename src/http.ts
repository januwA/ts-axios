import { AxiosError } from "./util/error";
import { IAxiosConfig, IAxiosResponse } from "./interfaces";
import { handleConfig } from "./util";

export function http<T>(config: IAxiosConfig): Promise<IAxiosResponse<T>> {
  return xhr<T>(handleConfig(config));
}

export function xhr<T>(config: IAxiosConfig): Promise<IAxiosResponse<T>> {
  return new Promise((resolve, reject) => {
    const {
      url = "",
      method = "get",
      data = null,
      headers = {},
      responseType = "json",
      timeout,
      cancelToken,
      onUploadProgress,
      onDownloadProgress,
      validateStatus
    } = config;
    const req = new XMLHttpRequest();

    // 默认设置为json的返回值
    req.responseType = responseType;
    if (timeout) req.timeout = timeout;

    // 监听上传进度
    if (onUploadProgress) req.upload.onprogress = onUploadProgress;

    req.open(method, url!, true);

    // 监听下载进度
    if (onDownloadProgress) req.onprogress = onDownloadProgress;

    req.onreadystatechange = function loaded() {
      if (this.readyState !== 4) {
        return;
      }

      const resHeaders = this.getAllResponseHeaders();
      const resData =
        responseType !== "text" ? this.response : this.responseText;
      const res: IAxiosResponse<T> = {
        data: resData as T,
        status: this.status,
        statusText: this.statusText,

        // 把headers字符串，解析object
        headers: resHeaders
          .split("\r\n")
          .filter(it => !!it.trim())
          .map(it => it.split(":"))
          .map(([k, v]) => ({ [k.toLowerCase()]: v.trim() }))
          .reduce((acc, it) => Object.assign(acc, it), {}),
        config: config,
        request: this
      };

      if (!validateStatus || validateStatus(this.status)) {
        resolve(res);
      } else {
        if (this.status !== 0)
          reject(
            new AxiosError(
              `请求错误 响应状态码${this.status}`,
              config,
              this.statusText,
              req,
              res
            )
          );
      }
    };
    req.onerror = function () {
      reject(new AxiosError(`网络错误`, config, this.statusText, req));
    };
    req.ontimeout = function () {
      reject(new AxiosError(`网络超时`, config, this.statusText, req));
    };

    // 如果是FormData就删除默认的content-type类型
    if (data instanceof FormData) {
      delete headers["content-type"];
    }

    for (const key in headers) {
      if (headers.hasOwnProperty(key)) {
        const v = headers[key];
        req.setRequestHeader(key, v);
      }
    }

    // 取消请求
    if (cancelToken) {
      if (!cancelToken.reason) {
        cancelToken?.promise.then(message => {
          req.abort();
          reject(message);
        });
      } else {
        throw `cancle token 已经被使用.`;
      }
    }
    req.send(data);
  });
}
