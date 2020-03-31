import { axios } from "../src/axios";
import { combineUrl, isAbsoluteUrl } from "../src/util";

const baseUrl = "http://localhost:3000/";
describe("Utils Test", () => {
  
  it("combineUrl Test", () => {
    expect(combineUrl(baseUrl, "/api/cats")).toBe(
      "http://localhost:3000/api/cats"
    );
  });

  it("isAbsoluteUrl Test", () => {
    expect(isAbsoluteUrl("http://localhost:3000")).toBe(true);
    expect(isAbsoluteUrl("https://localhost:3000")).toBe(true);
    expect(isAbsoluteUrl("//localhost:3000")).toBe(true);
  });

  it("getUri Test", () => {
    const r = axios.getUri({
      baseURL: "http://localhost:3000",
      url: "api/cats",
      params: "name=ajanuw"
    });
    expect(r).toBe("http://localhost:3000/api/cats?name=ajanuw");
  });
});
