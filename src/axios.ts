import { AxiosProxy } from "./axios-proxy";
import { IAxiosInstance, IAxiosConfig } from "./interfaces";
import { isCancel, CancelToken } from "./cancel-token";
import { defaultConfig } from "./default-config";
import { mergeConfig } from "./util/merge-config";

const keys = Object.getOwnPropertyNames(AxiosProxy.prototype).filter(
  name => name !== "constructor"
);

function createInstance(config: IAxiosConfig): IAxiosInstance {
  const context = new AxiosProxy(config);
  // 复制一个request方法
  const instance = AxiosProxy.prototype.request.bind(context);
  // 将实例后的[AxiosProxy]的属性拷给[instance]
  [...keys, ...Object.keys(context)].forEach(
    key => ((<any>instance)[key] = (<any>context)[key])
  );
  return instance as IAxiosInstance;
}

/**
 * use
 * ```js
 * axios();
 * axios.get()
 * axios.post()
 * ```
 */

export const axios = createInstance(defaultConfig);

// 实现一些静态函数
axios.create = function create(config: IAxiosConfig) {
  return createInstance(mergeConfig(defaultConfig, config));
};
axios.isCancel = isCancel;
axios.CancelToken = CancelToken as any;
axios.all = function all<T>(promises: Promise<T>[]) {
  return Promise.all(promises);
};
axios.spread = function spread<T, R>(cb: (...args: T[]) => R) {
  return function (args: T[]): R {
    return cb.apply(null, args);
  };
};
