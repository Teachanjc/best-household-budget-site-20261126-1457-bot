export function money(n) {
  const v = Math.round(n);
  const sign = v < 0 ? "-" : "";
  const digits = String(Math.abs(v)).split("");
  const out = [];
  while (digits.length > 3) out.unshift(digits.splice(digits.length - 3, 3).join(""));
  out.unshift(digits.join(""));
  return sign + "HK$" + out.join(",");
}

export function pct(part, whole) {
  if (!whole) return 0;
  return Math.round((part / whole) * 100);
}

export function pct1(part, whole) {
  if (!whole) return "0.0";
  return ((part / whole) * 100).toFixed(1);
}

export function monthDay(day) {
  return "Nov " + day;
}

export function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
