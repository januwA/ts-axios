import { http } from "./http";
import { IAxiosConfig, IAxiosResponse, HTTPMethod } from "./interfaces";
import { Interceptor } from "./interceptor";
import { mergeConfig } from "./util/merge-config";
import { handleConfig } from "./util";

export class AxiosProxy {
  /**
   * 拦截器
   */
  interceptors = {
    request: new Interceptor<IAxiosConfig>(),
    response: new Interceptor<IAxiosResponse<any>>()
  };

  /**
   *
   * @param defaults 默认配置
   */
  constructor(public defaults: IAxiosConfig) {}

  request<T>(config: IAxiosConfig): Promise<IAxiosResponse<T>>;
  request<T>(url: any, config?: IAxiosConfig): Promise<IAxiosResponse<T>> {
    if (typeof url === "string") {
      if (!config) config = {} as IAxiosConfig;
      config.url = url;
    } else {
      config = url;
    }

    const chain: any[] = [
      {
        res: http,
        rej: null
      }
    ];

    this.interceptors.request.forEach(interceptor => {
      chain.unshift(interceptor);
    });

    this.interceptors.response.forEach(interceptor => {
      chain.push(interceptor);
    });

    // 利用promise链，去使用request拦截器和rsponse拦截器
    let result = Promise.resolve(config);
    while (chain.length) {
      const { res, rej } = chain.shift();
      result = result.then(res, rej);
    }

    return result as Promise<IAxiosResponse<T>>;
  }

  get<T>(url: string, config?: IAxiosConfig): Promise<IAxiosResponse<T>> {
    return this._requestMethodWithoutData<T>("get", url, config);
  }
  delete<T>(url: string, config?: IAxiosConfig): Promise<IAxiosResponse<T>> {
    return this._requestMethodWithoutData<T>("delete", url, config);
  }
  head<T>(url: string, config?: IAxiosConfig): Promise<IAxiosResponse<T>> {
    return this._requestMethodWithoutData<T>("head", url, config);
  }
  options<T>(url: string, config?: IAxiosConfig): Promise<IAxiosResponse<T>> {
    return this._requestMethodWithoutData<T>("options", url, config);
  }
  post<T>(
    url: string,
    data?: any,
    config?: IAxiosConfig
  ): Promise<IAxiosResponse<T>> {
    return this._requestMethodWithData<T>("post", url, data, config);
  }
  put<T>(
    url: string,
    data?: any,
    config?: IAxiosConfig
  ): Promise<IAxiosResponse<T>> {
    return this._requestMethodWithData<T>("put", url, data, config);
  }
  patch<T>(
    url: string,
    data?: any,
    config?: IAxiosConfig
  ): Promise<IAxiosResponse<T>> {
    return this._requestMethodWithData<T>("patch", url, data, config);
  }

  getUri(config?: IAxiosConfig): string {
    return handleConfig(mergeConfig(this.defaults, config)).url || "";
  }

  private _requestMethodWithoutData<T>(
    method: HTTPMethod,
    url: string,
    config?: IAxiosConfig
  ) {
    return this.request<T>(
      Object.assign({}, config, {
        method,
        url
      })
    );
  }

  private _requestMethodWithData<T>(
    method: HTTPMethod,
    url: string,
    data?: any,
    config?: IAxiosConfig
  ) {
    return this.request<T>(
      Object.assign({}, config, {
        method: method,
        url,
        data
      })
    );
  }
}
