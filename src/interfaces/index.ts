import { AxiosProxy } from "../axios-proxy";
import { CancelToken } from "../cancel-token";

/**
 * 允许传入的请求方法
 */
export type HTTPMethod =
  | "get"
  | "post"
  | "delete"
  | "head"
  | "options"
  | "put"
  | "patch"
  | "GET"
  | "POST"
  | "DELETE"
  | "HEAD"
  | "OPTIONS"
  | "PUT"
  | "PATCH";

export interface IAxiosConfig {
  /**
   * 请求地址
   */
  url?: string;

  /**
   * 请求方法，默认GET
   */
  method?: HTTPMethod;

  /**
   * POST数据
   */
  data?: any;

  /**
   * 查询参数
   */
  params?: any;

  /**
   * 请求头
   */
  headers?: { [type: string]: any };

  /**
   * 请求返回数据类型
   */
  responseType?: XMLHttpRequestResponseType;

  /**
   * 请求超时时间
   */
  timeout?: number;

  cancelToken?: CancelToken;

  /**
   * 上传进度监听
   */
  onUploadProgress?: (e: ProgressEvent<EventTarget>) => void;

  /**
   * 下载进度监听
   */
  onDownloadProgress?: (e: ProgressEvent<EventTarget>) => void;

  /**
   * 允许自定义合法状态码范围
   */
  validateStatus?: (status: number) => boolean;

  /**
   * 自定义params的解析函数
   */
  paramsSerializer?: (params: any) => string;

  /**
   * 默认地址
   */
  baseURL?: string;
}

export interface IAxiosResponse<T> {
  data: T;
  status: number;
  statusText: string;
  headers: any;
  config: IAxiosConfig;
  request: any;
}

export interface IAxiosInstance extends AxiosProxy {
  <T>(config: IAxiosConfig): Promise<IAxiosResponse<T>>;
  <T>(url?: string, config?: IAxiosConfig): Promise<IAxiosResponse<T>>;

  create(config: IAxiosConfig): IAxiosInstance;
  CancelToken: CancelToken;
  isCancel(v: any): boolean;

  /**
   * 默认配置
   */
  defaults: IAxiosConfig;

  all<T>(promises: T | Promise<T>[]): Promise<T[]>;
  spread<T, R>(cb: (...args: T[]) => R): (arr: T[]) => R;
}
