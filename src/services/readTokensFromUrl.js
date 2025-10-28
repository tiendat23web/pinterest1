export function readTokensFromUrl() {
  // Ưu tiên hash (#access_token=...)
  const hash = window.location.hash?.startsWith("#")
    ? window.location.hash.slice(1)
    : "";
  const paramsHash = new URLSearchParams(hash);

  // Fallback: query (?access_token=...)
  const search = window.location.search?.startsWith("?")
    ? window.location.search.slice(1)
    : "";
  const paramsQuery = new URLSearchParams(search);

  const get = (k) => paramsHash.get(k) || paramsQuery.get(k);

  const access_token = get("access_token");
  if (!access_token) return null;

  const tokens = {
    access_token,
    refresh_token: get("refresh_token") || undefined,
    token_type: get("token_type") || undefined,
    expires_in: get("expires_in") || undefined,
  };

  // Dọn URL cho sạch
  window.history.replaceState({}, "", window.location.pathname);
  return tokens;
}
