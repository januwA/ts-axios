interface IResFn<T> {
  (v: T): T | Promise<T>;
}
interface IRejFn {
  (error: any): any;
}

/**
 * 拦截器
 */
export class Interceptor<T> {
  interceptor: Array<{
    res: IResFn<T>;
    rej?: IRejFn;
  } | null> = [];

  /**
   * 添加拦截器
   * @param res
   * @param rej
   */
  use(res: IResFn<T>, rej?: IRejFn): number {
    return this.interceptor.push({ res, rej }) - 1;
  }

  /**
   * 删除拦截器
   * @param id 拦截器id
   */
  eject(id: number): void {
    if (this.interceptor[id]) {
      this.interceptor[id] = null;
    }
  }

  forEach(fn: (interceptor: { res: IResFn<T>; rej?: IRejFn }) => void): void {
    this.interceptor.forEach(it => {
      if (it) fn(it);
    });
  }
}
