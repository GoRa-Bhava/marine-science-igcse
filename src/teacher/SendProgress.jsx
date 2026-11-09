import React, { useEffect, useMemo, useRef, useState } from "react";
import { buildReport, reportSummary } from "./buildReport.js";
import { encodeReport, reportUrl } from "./reportCodec.js";
import { qrSvg } from "./qr.js";

/* Student screen: "Send progress to your teacher".
 *
 * Builds a report from on-device progress, turns it into a #r= link (code lives
 * only in the URL fragment), and offers a QR code, Copy link and Share. Nothing
 * is uploaded — the student sends the link themselves. The name and class code
 * are remembered per profile via onSaveShareInfo.
 */
export default function SendProgress({
  C, theme, reportIndex, progressMap = {}, writingData = {},
  name: initialName = "", classCode: initialClass = "", examDate,
  onSaveShareInfo, onBack, fontUi, fontDisplay,
}) {
  const light = theme === "light";
  const F_UI = fontUi || "'Source Sans 3', ui-sans-serif, system-ui, sans-serif";
  const F_D = fontDisplay || "'Lexend', ui-sans-serif, system-ui, sans-serif";

  const [name, setName] = useState(initialName);
  const [classCode, setClassCode] = useState(initialClass);
  const [code, setCode] = useState("");
  const [toast, setToast] = useState("");
  const toastTimer = useRef(null);

  const report = useMemo(
    () => buildReport({ name: name.trim(), classCode: classCode.trim(), examDate }, { progressMap, writingData, index: reportIndex }),
    [name, classCode, examDate, progressMap, writingData, reportIndex]
  );
  const summary = useMemo(() => reportSummary(report), [report]);
  const ready = name.trim().length > 0;

  // Encode is async (CompressionStream). Recompute when the report changes.
  useEffect(() => {
    let live = true;
    if (!ready) { setCode(""); return; }
    encodeReport(report).then((c) => { if (live) setCode(c); }).catch(() => { if (live) setCode(""); });
    return () => { live = false; };
  }, [report, ready]);

  const url = code ? reportUrl(code) : "";
  const svg = useMemo(() => (url ? qrSvg(url) : ""), [url]);

  useEffect(() => () => { if (toastTimer.current) clearTimeout(toastTimer.current); }, []);
  function flash(msg) {
    setToast(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(""), 2600);
  }

  // Persist name/class per profile when the field loses focus.
  function persist() {
    if (onSaveShareInfo) onSaveShareInfo({ teacherName: name.trim(), classCode: classCode.trim() });
  }

  async function copyLink() {
    if (!url) return;
    try {
      await navigator.clipboard.writeText(url);
      flash("Link copied.");
    } catch {
      legacyCopy(url) ? flash("Link copied.") : flash("Couldn't copy — select and copy the link.");
    }
  }
  async function share() {
    if (!url) return;
    if (navigator.share) {
      try {
        await navigator.share({ title: "My marine science progress", text: `${name.trim()} — progress`, url });
        return;
      } catch (e) {
        if (e && e.name === "AbortError") return; // user cancelled
      }
    }
    copyLink(); // fallback: copy
  }

  // ---- style helpers (match WritingPractice / reader cards) ----
  const cardBg = light ? "#FFFFFF" : C.deep;
  const card = { background: cardBg, border: `1px solid ${C.line}`, borderRadius: 16, padding: 16 };
  const kicker = { fontFamily: F_UI, fontSize: 11, fontWeight: 800, letterSpacing: 0.7, textTransform: "uppercase", color: light ? C.accent : C.glow, margin: 0 };
  const h1 = { fontFamily: F_D, fontSize: 24, fontWeight: 800, color: C.foam, margin: "6px 0 2px" };
  const label = { fontFamily: F_UI, fontSize: 13, fontWeight: 700, color: C.foam, display: "block", marginBottom: 4 };
  const hint = { fontFamily: F_UI, fontSize: 13, color: C.mist, margin: "2px 0 0", lineHeight: 1.5 };
  const input = { fontFamily: F_UI, fontSize: 15, width: "100%", boxSizing: "border-box", padding: "11px 12px", borderRadius: 10, border: `1px solid ${C.line}`, background: light ? C.raise : C.shelf, color: C.foam };
  const btnP = { fontFamily: F_UI, fontWeight: 800, fontSize: 15, padding: "12px 18px", borderRadius: 12, border: "none", background: light ? C.accent : C.glow, color: light ? "#fff" : C.abyss, cursor: ready ? "pointer" : "not-allowed", opacity: ready ? 1 : 0.5 };
  const btnS = { fontFamily: F_UI, fontWeight: 700, fontSize: 14.5, padding: "12px 16px", borderRadius: 12, border: `1px solid ${C.line}`, background: light ? C.raise : C.shelf, color: C.foam, cursor: ready ? "pointer" : "not-allowed", opacity: ready ? 1 : 0.5 };
  const linkBtn = { fontFamily: F_UI, fontWeight: 700, fontSize: 14, background: "none", border: "none", color: light ? C.accent : C.glow, cursor: "pointer", padding: "4px 0" };

  return (
    <div style={{ maxWidth: 560, margin: "0 auto", display: "flex", flexDirection: "column", gap: 16 }}>
      {onBack && <button style={linkBtn} onClick={onBack}>← Back</button>}

      <div>
        <p style={kicker}>Share your progress</p>
        <h1 style={h1}>Send progress to your teacher</h1>
        <p style={hint}>Nothing is uploaded: you send the link yourself. It contains the name you type below, your scores and your recent answers — nothing else, and nothing is stored by Wildcat Education.</p>
      </div>

      <div style={{ ...card, display: "flex", flexDirection: "column", gap: 14 }}>
        <div>
          <label style={label} htmlFor="sp-name">The name your teacher knows you by</label>
          <input id="sp-name" style={input} value={name} maxLength={30} placeholder="e.g. Maya R"
            onChange={(e) => setName(e.target.value)} onBlur={persist} autoComplete="off" />
        </div>
        <div>
          <label style={label} htmlFor="sp-class">Class code <span style={{ fontWeight: 500, color: C.mist }}>(optional)</span></label>
          <input id="sp-class" style={input} value={classCode} maxLength={20} placeholder="e.g. 10B-MARINE"
            onChange={(e) => setClassCode(e.target.value)} onBlur={persist} autoComplete="off" />
        </div>
      </div>

      {ready ? (
        <div style={{ ...card, display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
          <div aria-hidden={!svg} style={{ width: 220, height: 220, background: "#fff", borderRadius: 12, padding: 10, boxSizing: "border-box", display: "flex", alignItems: "center", justifyContent: "center" }}>
            {svg
              ? <div style={{ width: "100%", height: "100%" }} dangerouslySetInnerHTML={{ __html: svg }} />
              : <span style={{ ...hint, margin: 0 }}>Preparing…</span>}
          </div>
          <p style={{ ...hint, textAlign: "center", margin: 0 }}>Includes {summary}</p>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center" }}>
            <button style={btnS} onClick={copyLink} disabled={!url}>Copy link</button>
            <button style={btnP} onClick={share} disabled={!url}>Share…</button>
          </div>
          {toast && <p role="status" style={{ ...hint, margin: 0, color: light ? C.accent : C.glow, fontWeight: 700 }}>{toast}</p>}
        </div>
      ) : (
        <p style={{ ...hint, textAlign: "center" }}>Type the name your teacher knows you by to make your link.</p>
      )}
    </div>
  );
}

// Last-ditch clipboard fallback for browsers without the async clipboard API.
function legacyCopy(text) {
  try {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(ta);
    return ok;
  } catch {
    return false;
  }
}
