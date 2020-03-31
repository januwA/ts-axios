import { IAxiosConfig } from "~src/interfaces";
import { isObject } from ".";

/**
 * 将default config合并到每次请求的config中
 * @param dConfig 默认配置
 * @param config 每次请求配置
 */
export function mergeConfig(
  dConfig: IAxiosConfig,
  config: IAxiosConfig = {}
): IAxiosConfig {
  const result: { [k: string]: any } = {};

  for (const key in config) {
    if (config.hasOwnProperty(key)) {
      const v = (<any>config)[key];
      if (key === "headers") {
        if (isObject(v)) {
          result[key] = {};
          Object.keys(v).forEach(k => (result[key][k] = v[k]));
        }
      } else {
        if (["url", "data", "params"].includes(key)) {
          result[key] = v;
        } else {
          result[key] = v ? v : (<any>dConfig)[key];
        }
      }
    }
  }

  for (const key in dConfig) {
    if (dConfig.hasOwnProperty(key)) {
      const v = (<any>dConfig)[key];
      if (key === "headers") {
        if (!result[key]) {
          result[key] = {};
        }
        Object.keys(v.common).forEach(k => {
          if (!result[key][k]) result[key][k] = v.common[k];
        });
      } else {
        if (!result[key]) {
          result[key] = v;
        }
      }
    }
  }

  // 添加与method相对应的headers
  if (dConfig.headers && dConfig.headers[result.method]) {
    Object.keys(dConfig.headers[result.method]).forEach(k => {
      if (!result.headers[k])
        result.headers[k] = dConfig!.headers![result.method][k];
    });
  }

  return result as IAxiosConfig;
}
