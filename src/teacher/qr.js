/* Teacher tools — QR rendering. Uses the bundled @paulmillr/qr (0 deps, pure JS,
 * MIT) — a local library, never a CDN or network call. We take the raw module
 * matrix and draw our own SVG so the code is always dark-on-white with a quiet
 * zone, guaranteeing it scans regardless of the app's light/dark theme.
 */
import encodeQR from "@paulmillr/qr";

// Longer payloads need a lower error-correction level to stay within QR capacity
// (a full report code is ~1.5 KB). Short codes can afford "medium" for robustness.
function eccFor(text) {
  return text.length > 800 ? "low" : "medium";
}

// Boolean module matrix (true = dark). Exposed for tests.
export function qrMatrix(text, ecc = eccFor(text)) {
  return encodeQR(text, "raw", { ecc });
}

// A crisp, scannable SVG string: dark modules on a white ground, with a quiet
// zone. Colours are fixed (not theme variables) because scanners need contrast.
export function qrSvg(text, { quiet = 4, ecc } = {}) {
  const m = encodeQR(text, "raw", { ecc: ecc || eccFor(text) });
  const n = m.length;
  const size = n + quiet * 2;
  let d = "";
  for (let y = 0; y < n; y++) {
    for (let x = 0; x < n; x++) {
      if (m[y][x]) d += `M${x + quiet} ${y + quiet}h1v1h-1z`;
    }
  }
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" ` +
    `shape-rendering="crispEdges" role="img" aria-label="QR code">` +
    `<rect width="${size}" height="${size}" fill="#ffffff"/>` +
    `<path d="${d}" fill="#000000"/></svg>`
  );
}
