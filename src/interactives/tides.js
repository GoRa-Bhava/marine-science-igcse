export const LUNAR_TIDE = 1;
export const SOLAR_TIDE = 0.4;
export const TIDE_LABEL_TOLERANCE = 18;
export const QUICK_CHECK_TOLERANCE = 15;

export function normalizeAngle(value) {
  const angle = Number(value) || 0;
  return ((angle % 360) + 360) % 360;
}

export function angularDistance(a, b) {
  const difference = Math.abs(normalizeAngle(a) - normalizeAngle(b));
  return Math.min(difference, 360 - difference);
}

export function tidalRange(angle) {
  const theta = normalizeAngle(angle) * Math.PI / 180;
  return LUNAR_TIDE + SOLAR_TIDE * Math.cos(2 * theta);
}

export function tidalRangeLevel(angle) {
  return tidalRange(angle) / (LUNAR_TIDE + SOLAR_TIDE);
}

function nearAny(angle, targets, tolerance) {
  return targets.some((target) => angularDistance(angle, target) <= tolerance);
}

export function tideLabel(angle, tolerance = TIDE_LABEL_TOLERANCE) {
  if (nearAny(angle, [0, 180], tolerance)) return "Spring tide";
  if (nearAny(angle, [90, 270], tolerance)) return "Neap tide";
  return "Between spring and neap";
}

export function isTideTarget(angle, target, tolerance = QUICK_CHECK_TOLERANCE) {
  if (target === "spring") return nearAny(angle, [0, 180], tolerance);
  if (target === "neap") return nearAny(angle, [90, 270], tolerance);
  return false;
}

export function moonPhase(angle) {
  const a = normalizeAngle(angle);
  if (angularDistance(a, 0) <= 12) return "New Moon";
  if (angularDistance(a, 90) <= 12) return "First quarter";
  if (angularDistance(a, 180) <= 12) return "Full Moon";
  if (angularDistance(a, 270) <= 12) return "Last quarter";
  if (a < 90) return "Waxing crescent";
  if (a < 180) return "Waxing gibbous";
  if (a < 270) return "Waning gibbous";
  return "Waning crescent";
}

export function tidalRangeText(angle) {
  return `${Math.round(tidalRangeLevel(angle) * 100)}% of spring-tide amplitude`;
}
