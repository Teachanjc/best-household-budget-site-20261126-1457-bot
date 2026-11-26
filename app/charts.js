import { pct1 } from "./format.js";

export function donut(segments, total, centerTop, centerBottom) {
  const radius = 84;
  const circ = 2 * Math.PI * radius;
  let offset = 0;
  const parts = segments.map((s) => {
    const frac = total > 0 ? s.value / total : 0;
    const len = Math.max(frac * circ - 2, 0);
    const piece =
      '<circle cx="110" cy="110" r="' + radius + '" fill="none" stroke="' + s.color +
      '" stroke-width="30" stroke-dasharray="' + len.toFixed(1) + " " + (circ - len).toFixed(1) +
      '" stroke-dashoffset="' + (-offset).toFixed(1) + '" />\n';
    offset += frac * circ;
    return piece;
  }).join("");
  return (
    '<svg class="donut" viewBox="0 0 220 220" role="img" aria-label="Spending by category chart">\n' +
    '<circle cx="110" cy="110" r="' + radius + '" fill="none" stroke="#eef0ea" stroke-width="30" />\n' +
    parts +
    '<text x="110" y="104" text-anchor="middle" class="donut-center-top">' + centerTop + '</text>\n' +
    '<text x="110" y="128" text-anchor="middle" class="donut-center-bottom">' + centerBottom + '</text>\n' +
    "</svg>\n"
  );
}

export function legend(segments, total) {
  return segments.map((s) =>
    '<li><span class="swatch" style="background:' + s.color + '"></span>' +
    '<span class="legend-label">' + s.label + '</span>' +
    '<span class="legend-value">' + pct1(s.value, total) + "%</span></li>\n"
  ).join("");
}

export function bars(rows, maxValue) {
  const width = 640;
  const height = 300;
  const bottom = 268;
  const top = 24;
  const gap = 14;
  const bw = (width - gap * (rows.length + 1)) / rows.length;
  let out = '<svg class="bars" viewBox="0 0 640 300" role="img" aria-label="Monthly income and spending chart">\n';
  out += '<line x1="0" y1="' + bottom + '" x2="640" y2="' + bottom + '" class="axis" />\n';
  rows.forEach((r, i) => {
    const x = gap + i * (bw + gap);
    const incH = Math.max(((bottom - top) * r.income) / maxValue, 2);
    const spH = Math.max(((bottom - top) * r.spent) / maxValue, 2);
    out += '<rect x="' + x.toFixed(1) + '" y="' + (bottom - incH).toFixed(1) + '" width="' + (bw / 2 - 2).toFixed(1) +
      '" height="' + incH.toFixed(1) + '" rx="3" class="bar-income" />\n';
    out += '<rect x="' + (x + bw / 2 + 2).toFixed(1) + '" y="' + (bottom - spH).toFixed(1) + '" width="' + (bw / 2 - 2).toFixed(1) +
      '" height="' + spH.toFixed(1) + '" rx="3" class="bar-spent" />\n';
    out += '<text x="' + (x + bw / 2).toFixed(1) + '" y="290" text-anchor="middle" class="bar-label">' + r.short + '</text>\n';
  });
  out += "</svg>\n";
  return out;
}
