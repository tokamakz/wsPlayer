/**
 * @param str: string | null | undefined | unknown
 * @returns true: str is empty
 */
// TODO: 开头为空，是否需要判定为空字符串
export function isEmptyStr(
  str: string | null | undefined | unknown
): str is null {
  if (str === null) return true;
  if (typeof str === "undefined") return true;

  if (typeof str === "string") {
    if (str === "") return true;

    // eslint-disable-next-line no-irregular-whitespace
    const reg = /^([ ]+)|([　]+)$/;
    return reg.test(str);
  }
  return false;
}
