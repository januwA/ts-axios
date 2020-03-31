import { IAxiosConfig, IAxiosResponse } from "../interfaces";

export class AxiosError extends Error {
  constructor(
    public message: string,
    public config: IAxiosConfig,
    public code?: string,
    public request?: any,
    public response?: IAxiosResponse<any>
  ) {
    super(message);

    Object.setPrototypeOf(this, AxiosError.prototype);
  }

  
}
