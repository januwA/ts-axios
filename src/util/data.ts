import { isObject } from ".";

export function transformSendData(data?: any) {
  if (!data) return null;
  if (isObject(data)) {
    return JSON.stringify(data);
  }

  return data;
}
