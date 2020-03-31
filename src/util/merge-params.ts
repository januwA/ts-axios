import { isObject } from ".";

function joinParams(url: string, params: string) {
  const hasDefaultParams = url.split("?").length > 1;
  return url + (hasDefaultParams ? `&${params}` : `?${params}`);
}

/**
 * 将params参数合并到url
 * @param url
 * @param params
 */
export function mergeParams(
  url: string,
  params?: any,
  paramsSerializer?: (params: any) => string
) {
  if (!params) return url;
  if (paramsSerializer) {
    return joinParams(url, paramsSerializer(params));
  }
  if (typeof params === "string") {
    return joinParams(url, params);
  }
  if (params instanceof URLSearchParams) {
    return joinParams(url, params.toString());
  }
  let search = "";
  Object.keys(params).forEach(k => {
    let v = params[k];
    if (!v) return;
    if (Array.isArray(v)) {
      v.forEach(it => {
        search += `&${k}=${encodeURIComponent(it)}`;
      });
    } else {
      if (isObject(v)) {
        search += `&${k}=${JSON.stringify(v)}`;
      } else {
        search += `&${k}=${encodeURIComponent(v)}`;
      }
    }
  });

  search = search.substr(1); // 斩掉字符串拼接的第一个&符号
  return joinParams(url, search);
}
