import { useRef, useEffect, useState, useCallback } from "react";

/**
 * MarineInteractive
 * -----------------
 * Embeds one self-contained interactive (a full HTML document string) inside an
 * isolated, auto-sizing iframe. The interactive keeps its own CSS/JS/fonts, so it
 * can never collide with the host app's styles or state.
 *
 * Why an iframe (srcDoc) rather than porting each SVG+JS to React:
 *  - zero rewrite, so the vetted science/visuals stay byte-for-byte identical
 *  - full style + script isolation
 *  - srcDoc runs same-origin, so the host can measure height, sync theme, and
 *    observe the learner's first interaction without any message plumbing.
 *
 * Props:
 *   html      (string)   full standalone HTML document for the interactive
 *   title     (string)   accessible iframe title
 *   theme     ('auto'|'light'|'dark')  forces the interactive's colour scheme; 'auto' = follow OS
 *   onEngaged (fn)        fires ONCE, on the learner's first interaction (hook for the
 *                         retrieval loop / "Ocean Discoveries" reward roll)
 *   minHeight (number)    fallback height before first measure (default 300)
 *   className (string)
 */
export default function MarineInteractive({
  html,
  title,
  theme = "auto",
  onEngaged,
  minHeight = 300,
  className,
}) {
  const ref = useRef(null);
  const [h, setH] = useState(minHeight);
  const engaged = useRef(false);

  const measure = useCallback(() => {
    const doc = ref.current?.contentDocument;
    if (!doc?.documentElement) return;
    const next = Math.ceil(
      doc.documentElement.getBoundingClientRect().height || doc.body?.scrollHeight || 0
    );
    if (next) setH((prev) => (Math.abs(next - prev) > 2 ? next : prev));
  }, []);

  useEffect(() => {
    const iframe = ref.current;
    if (!iframe) return;
    let ro;
    const onLoad = () => {
      const doc = iframe.contentDocument;
      if (!doc) return;

      // theme sync — the interactives honour data-theme="light|dark" on <html>
      const root = doc.documentElement;
      if (theme === "light" || theme === "dark") root.setAttribute("data-theme", theme);
      else root.removeAttribute("data-theme");

      // engagement: first interaction only
      const fire = () => {
        if (engaged.current) return;
        engaged.current = true;
        onEngaged?.();
      };
      ["pointerdown", "keydown", "input", "change"].forEach((ev) =>
        doc.addEventListener(ev, fire, { passive: true })
      );

      // auto-size
      measure();
      try {
        ro = new ResizeObserver(measure);
        ro.observe(root);
      } catch (_) {}
      // re-measure after fonts / images settle
      setTimeout(measure, 300);
      setTimeout(measure, 900);
    };

    iframe.addEventListener("load", onLoad);
    // If already loaded (fast cache), kick once.
    if (iframe.contentDocument?.readyState === "complete") onLoad();
    return () => {
      iframe.removeEventListener("load", onLoad);
      ro?.disconnect();
      engaged.current = false;
    };
    // Re-run when the html/theme changes (switching interactive resets engagement).
  }, [html, theme, measure, onEngaged]);

  return (
    <iframe
      ref={ref}
      title={title}
      srcDoc={html}
      className={className}
      // allow-same-origin + allow-scripts: required so the interactive runs AND the
      // host can read contentDocument to size/theme it. The content is first-party.
      sandbox="allow-scripts allow-same-origin"
      loading="lazy"
      style={{
        width: "100%",
        height: h,
        border: 0,
        display: "block",
        borderRadius: 16,
        background: "transparent",
      }}
    />
  );
}
