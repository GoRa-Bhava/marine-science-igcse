import React from "react";

/* Slim, non-blocking update banner for the home screen. Pushes content down (it
   is not a toast or modal). Driven by the descriptor from useUpdateNotice():
   - { platform:"native", phase:"available", latest } → Download / Later
   - { platform:"native", phase:"downloading" }       → progress text, no buttons
   - { platform:"web" }                               → Update now / Later
   The primary action is first in the DOM so it is first in tab order. */

const FONT_UI = "'Source Sans 3', ui-sans-serif, system-ui, sans-serif";

export default function UpdateBanner({ C, notice, onDownload, onUpdate, onLater }) {
  if (!notice) return null;

  const wrap = {
    display: "flex", flexWrap: "wrap", alignItems: "center", gap: 10,
    margin: "0 0 16px", padding: "12px 14px", borderRadius: 14,
    border: `1px solid ${C.glow}`, background: C.shelf,
    fontFamily: FONT_UI,
  };
  const textStyle = { flex: "1 1 180px", minWidth: 0, fontSize: 14.5, color: C.foam, lineHeight: 1.4 };
  const row = { display: "flex", gap: 8, flexShrink: 0 };
  const primaryBtn = {
    minHeight: 44, padding: "0 16px", borderRadius: 11, cursor: "pointer",
    border: `1px solid ${C.glow}`, background: "rgba(79,216,196,.14)", color: C.foam,
    fontFamily: FONT_UI, fontSize: 14.5, fontWeight: 700,
  };
  const laterBtn = {
    minHeight: 44, padding: "0 14px", borderRadius: 11, cursor: "pointer",
    border: `1px solid ${C.line}`, background: "transparent", color: C.mist,
    fontFamily: FONT_UI, fontSize: 14.5, fontWeight: 600,
  };

  if (notice.platform === "native" && notice.phase === "downloading") {
    return (
      <div role="status" aria-live="polite" style={wrap}>
        <span style={textStyle}>Downloading… When it finishes, open the file to install. Your progress is kept.</span>
      </div>
    );
  }

  // Web: the user has tapped Update and the new version is being applied. The
  // page reloads a moment later, so this shows only briefly.
  if (notice.platform === "web" && notice.phase === "updating") {
    return (
      <div role="status" aria-live="polite" style={wrap}>
        <span style={textStyle}>Updating to the latest version…</span>
      </div>
    );
  }

  // Web: confirmation after the reload. Auto-hides after a few seconds.
  if (notice.platform === "web" && notice.phase === "done") {
    return (
      <div role="status" aria-live="polite" style={{ ...wrap, borderColor: C.ok }}>
        <span style={textStyle}><span aria-hidden="true">✓ </span>Update complete — you're on the latest version.</span>
      </div>
    );
  }

  const isNative = notice.platform === "native";
  const message = isNative
    ? `A new version of Marine Science is ready (build ${notice.latest}).`
    : "New questions and fixes are ready.";
  const primaryLabel = isNative ? "Download" : "Update now";
  const onPrimary = isNative ? onDownload : onUpdate;

  return (
    <div role="status" aria-live="polite" style={wrap}>
      <span style={textStyle}>{message}</span>
      <div style={row}>
        <button type="button" onClick={onPrimary} style={primaryBtn}>{primaryLabel}</button>
        <button type="button" onClick={onLater} style={laterBtn}>Later</button>
      </div>
    </div>
  );
}
