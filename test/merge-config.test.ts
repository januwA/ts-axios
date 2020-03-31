import { mergeConfig } from "../src/util/merge-config";
import { defaultConfig } from "../src/default-config";
import { IAxiosConfig } from "../src/interfaces";

let config: IAxiosConfig;

beforeAll(() => {
  defaultConfig.headers.common["X-d-test"] = "xxx";
  defaultConfig.headers.get["X-get-h"] = "xxh ";
  config = mergeConfig(defaultConfig, {
    method: "get",
    url: "http://localhost:3000",
    params: {
      name: "ajanuw"
    },
    headers: {
      "X-test": "xxx"
    }
  });
});
describe("mergeConfig Test", () => {
  it("config method Test", () => {
    expect(config.method).toBe("get");
  });
  it("config url Test", () => {
    expect(config.url).toBe("http://localhost:3000");
  });
  it("config headers Test", () => {
    expect(config.headers).toBeTruthy();
    if (config.headers) {
      expect(config.headers["X-test"]).toBe("xxx");
      expect(config.headers["X-d-test"]).toBe("xxx");
      expect(config.headers["X-get-h"]).toBe("xxh ");
    }
  });
});
