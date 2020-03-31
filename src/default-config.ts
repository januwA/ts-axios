import { IAxiosConfig } from "./interfaces";

// 创建一个默认配置
export const defaultConfig: IAxiosConfig & {
  headers: {
    common: { [k: string]: any };
  };
} = {
  method: "get",
  headers: {
    // 所有请求都会有效
    common: {}
  },

  /**
   * 默认状态码的验证函数
   * @param status 
   */
  validateStatus(status: number): boolean {
    return Math.floor(status / 100) === 2;
  }
};

const methodNotData = ["options", "head", "get", "delete"];
methodNotData.forEach(m => (defaultConfig.headers![m] = {}));

const methodWithData = ["post", "put", "patch"];
methodWithData.forEach(
  m =>
    (defaultConfig.headers![m] = {
      "content-type": "application/x-www-form-urlencoded"
    })
);
