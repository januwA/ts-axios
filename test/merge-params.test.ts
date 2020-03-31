import { mergeParams } from "../src/util/merge-params";

const _url = "http://localhost:3000/api/cats";
const _urlp = "http://localhost:3000/api/cats/name=ajanuw&foo=bar";

describe("mergeParams Test", () => {
  it("not  params Test", () => {
    const url = mergeParams(_url);
    expect(url).toBe(_url);
  });

  it("not default params Test", () => {
    const url = mergeParams("http://localhost:3000/api/cats", {
      name: "ajanuw",
      arr: [1, 2]
    });
    expect(url).toBe("http://localhost:3000/api/cats?name=ajanuw&arr=1&arr=2");
  });

  it("has default params Test", () => {
    const url = mergeParams("http://localhost:3000/api/cats?name=x", {
      name: "ajanuw",
      arr: [1, 2]
    });
    expect(url).toBe("http://localhost:3000/api/cats?name=x&name=ajanuw&arr=1&arr=2");
  });
});
