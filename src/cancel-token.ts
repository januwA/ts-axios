interface ICancel {
  (message?: string): void;
}
interface IExecutor {
  (executor: ICancel): void;
}

export class Cancel {
  constructor(public message?: string) {}
}

export function isCancel(v: any): v is Cancel {
  return v instanceof Cancel;
}

export class CancelToken {
  promise: Promise<Cancel>;
  reason?: Cancel;

  constructor(executor: IExecutor) {
    let _resolve: (reason?: Cancel) => void;

    this.promise = new Promise<Cancel>(resolve => (_resolve = resolve));

    // 发送一个回调函数给外界
    executor(message => {
      if (!this.reason) {
        this.reason = new Cancel(message);
        _resolve(this.reason);
      }
    });
  }

  static source() {
    let cancel!: ICancel;
    const token = new CancelToken(c => (cancel = c));
    return {
      token,
      cancel
    };
  }
}
