// Runtime API host resolver for static hosting (GitHub Pages, etc).
//
// Priority:
// 1) ?api=https://your-user.pythonanywhere.com
// 2) localStorage "api_base_url"
// 3) pre-defined window.API_BASE_URL (if you hardcoded it before this script)
// 4) empty -> same-origin (local dev / single host)
(function resolveApiBaseUrl() {
  var queryApi = "";
  try {
    var params = new URLSearchParams(window.location.search || "");
    queryApi = String(params.get("api") || "").trim();
  } catch (e) {
    queryApi = "";
  }

  var storedApi = "";
  try {
    storedApi = String(window.localStorage.getItem("api_base_url") || "").trim();
  } catch (e) {
    storedApi = "";
  }

  var predefinedApi = String(window.API_BASE_URL || "").trim();
  var defaultApi = "https://api-webapp-tanki-online-production.up.railway.app";
  var selected = queryApi || storedApi || predefinedApi || defaultApi;
  selected = selected.replace(/\/+$/, "");

  if (queryApi) {
    try {
      window.localStorage.setItem("api_base_url", selected);
    } catch (e) {
      // ignore storage errors
    }
  }

  window.API_BASE_URL = selected;
})();

