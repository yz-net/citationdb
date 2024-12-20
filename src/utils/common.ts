export function normalizeString(term: string) {
  return (term ?? "").toString().trim().toLowerCase();
}

export function replaceKeys(
  dictObj: Record<string, string>,
  keyMap: Record<string, string>,
) {
  const ret = {};
  for (const k in dictObj) {
    // @ts-ignore
    ret[keyMap[k]] = dictObj[k];
  }
  return ret;
}

export function arrayToObject(arr: any[]) {
  if (!Array.isArray(arr)) {
    return {};
  }

  const obj: Record<string, any> = {};
  arr.forEach((item) => {
    obj[item.id] = item;
  });

  return obj;
}

export function objectToArray(obj: Record<string, any>) {
  obj = obj || {};
  return Object.keys(obj).map((k) => obj[k]);
}
