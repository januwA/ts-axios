import { IAxiosConfig } from "~src/interfaces";
import { mergeParams } from "./merge-params";
import { transformSendData } from "./data";

export function isObject(v: any): v is Object {
  return Object.prototype.toString.call(v) === "[object Object]";
}

export function isAbsoluteUrl(url: string) {
  return /(^[a-z][a-z\d\-\+\.]*:)?\/\//i.test(url);
}

export function combineUrl(baseUrl: string, url?: string) {
  return url
    ? baseUrl.replace(/\/+$/, "") + "/" + url.replace(/^\/+/, "")
    : baseUrl;
}

export function handleConfig(config: IAxiosConfig) {
  // 拼接baseurl和url
  if (config.baseURL && !isAbsoluteUrl(config.url || "")) {
    config.url = combineUrl(config.baseURL, config.url);
  }

  // 拼接params
  config.url = mergeParams(config.url!, config.params, config.paramsSerializer);

  // 处理data数据
  config.data = transformSendData(config.data);
  return config;
}
