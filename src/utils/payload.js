export function parseNumberIfPossible(v) {
  if (v === null || v === undefined) return v;
  const s = String(v).trim();
  if (s === "") return "";
  const n = Number(s);
  return isNaN(n) ? s : n;
}

export function keepPayloadKeys(value) {
  if (Array.isArray(value)) {
    return value.map((item) =>
      item === undefined ? "" : keepPayloadKeys(item),
    );
  }
  if (value && typeof value === "object") {
    return Object.keys(value).reduce((acc, key) => {
      acc[key] = value[key] === undefined ? "" : keepPayloadKeys(value[key]);
      return acc;
    }, {});
  }
  return value;
}
