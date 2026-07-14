"use client"
import React from 'react';


// tweaks-panel.jsx
// Reusable Tweaks shell + form-control helpers.
//
// Owns the host protocol (listens for __activate_edit_mode / __deactivate_edit_mode,
// posts __edit_mode_available / __edit_mode_set_keys / __edit_mode_dismissed) so
// individual prototypes don't re-roll it. Ships a consistent set of controls so you
// don't hand-draw <input type="range">, segmented radios, steppers, etc.
//
// Usage (in an HTML file that loads React + Babel):
//
//   const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
//     "primaryColor": "#D97757",
//     "palette": ["#D97757", "#29261b", "#f6f4ef"],
//     "fontSize": 16,
//     "density": "regular",
//     "dark": false
//   }/*EDITMODE-END*/;
//
//   function App() {
//     const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
//     return (
//       <div style={{ fontSize: t.fontSize, color: t.primaryColor }}>
//         Hello
//         <TweaksPanel>
//           <TweakSection label="Typography" />
//           <TweakSlider label="Font size" value={t.fontSize} min={10} max={32} unit="px"
//                        onChange={(v) => setTweak('fontSize', v)} />
//           <TweakRadio  label="Density" value={t.density}
//                        options={['compact', 'regular', 'comfy']}
//                        onChange={(v) => setTweak('density', v)} />
//           <TweakSection label="Theme" />
//           <TweakColor  label="Primary" value={t.primaryColor}
//                        options={['#D97757', '#2A6FDB', '#1F8A5B', '#7A5AE0']}
//                        onChange={(v) => setTweak('primaryColor', v)} />
//           <TweakColor  label="Palette" value={t.palette}
//                        options={[['#D97757', '#29261b', '#f6f4ef'],
//                                  ['#475569', '#0f172a', '#f1f5f9']]}
//                        onChange={(v) => setTweak('palette', v)} />
//           <TweakToggle label="Dark mode" value={t.dark}
//                        onChange={(v) => setTweak('dark', v)} />
//         </TweaksPanel>
//       </div>
//     );
//   }
//
// ─────────────────────────────────────────────────────────────────────────────

const __TWEAKS_STYLE = `
  .twk-panel{position:fixed;right:16px;bottom:16px;z-index:2147483646;width:280px;
    max-height:calc(100vh - 32px);display:flex;flex-direction:column;
    transform:scale(var(--dc-inv-zoom,1));transform-origin:bottom right;
    background:rgba(250,249,247,.78);color:#29261b;
    -webkit-backdrop-filter:blur(24px) saturate(160%);backdrop-filter:blur(24px) saturate(160%);
    border:.5px solid rgba(255,255,255,.6);border-radius:14px;
    box-shadow:0 1px 0 rgba(255,255,255,.5) inset,0 12px 40px rgba(0,0,0,.18);
    font:11.5px/1.4 ui-sans-serif,system-ui,-apple-system,sans-serif;overflow:hidden}
  .twk-hd{display:flex;align-items:center;justify-content:space-between;
    padding:10px 8px 10px 14px;cursor:move;user-select:none}
  .twk-hd b{font-size:12px;font-weight:600;letter-spacing:.01em}
  .twk-x{appearance:none;border:0;background:transparent;color:rgba(41,38,27,.55);
    width:22px;height:22px;border-radius:6px;cursor:default;font-size:13px;line-height:1}
  .twk-x:hover{background:rgba(0,0,0,.06);color:#29261b}
  .twk-body{padding:2px 14px 14px;display:flex;flex-direction:column;gap:10px;
    overflow-y:auto;overflow-x:hidden;min-height:0;
    scrollbar-width:thin;scrollbar-color:rgba(0,0,0,.15) transparent}
  .twk-body::-webkit-scrollbar{width:8px}
  .twk-body::-webkit-scrollbar-track{background:transparent;margin:2px}
  .twk-body::-webkit-scrollbar-thumb{background:rgba(0,0,0,.15);border-radius:4px;
    border:2px solid transparent;background-clip:content-box}
  .twk-body::-webkit-scrollbar-thumb:hover{background:rgba(0,0,0,.25);
    border:2px solid transparent;background-clip:content-box}
  .twk-row{display:flex;flex-direction:column;gap:5px}
  .twk-row-h{flex-direction:row;align-items:center;justify-content:space-between;gap:10px}
  .twk-lbl{display:flex;justify-content:space-between;align-items:baseline;
    color:rgba(41,38,27,.72)}
  .twk-lbl>span:first-child{font-weight:500}
  .twk-val{color:rgba(41,38,27,.5);font-variant-numeric:tabular-nums}

  .twk-sect{font-size:10px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;
    color:rgba(41,38,27,.45);padding:10px 0 0}
  .twk-sect:first-child{padding-top:0}

  .twk-field{appearance:none;box-sizing:border-box;width:100%;min-width:0;height:26px;padding:0 8px;
    border:.5px solid rgba(0,0,0,.1);border-radius:7px;
    background:rgba(255,255,255,.6);color:inherit;font:inherit;outline:none}
  .twk-field:focus{border-color:rgba(0,0,0,.25);background:rgba(255,255,255,.85)}
  select.twk-field{padding-right:22px;
    background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'><path fill='rgba(0,0,0,.5)' d='M0 0h10L5 6z'/></svg>");
    background-repeat:no-repeat;background-position:right 8px center}

  .twk-slider{appearance:none;-webkit-appearance:none;width:100%;height:4px;margin:6px 0;
    border-radius:999px;background:rgba(0,0,0,.12);outline:none}
  .twk-slider::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;
    width:14px;height:14px;border-radius:50%;background:#fff;
    border:.5px solid rgba(0,0,0,.12);box-shadow:0 1px 3px rgba(0,0,0,.2);cursor:default}
  .twk-slider::-moz-range-thumb{width:14px;height:14px;border-radius:50%;
    background:#fff;border:.5px solid rgba(0,0,0,.12);box-shadow:0 1px 3px rgba(0,0,0,.2);cursor:default}

  .twk-seg{position:relative;display:flex;padding:2px;border-radius:8px;
    background:rgba(0,0,0,.06);user-select:none}
  .twk-seg-thumb{position:absolute;top:2px;bottom:2px;border-radius:6px;
    background:rgba(255,255,255,.9);box-shadow:0 1px 2px rgba(0,0,0,.12);
    transition:left .15s cubic-bezier(.3,.7,.4,1),width .15s}
  .twk-seg.dragging .twk-seg-thumb{transition:none}
  .twk-seg button{appearance:none;position:relative;z-index:1;flex:1;border:0;
    background:transparent;color:inherit;font:inherit;font-weight:500;min-height:22px;
    border-radius:6px;cursor:default;padding:4px 6px;line-height:1.2;
    overflow-wrap:anywhere}

  .twk-toggle{position:relative;width:32px;height:18px;border:0;border-radius:999px;
    background:rgba(0,0,0,.15);transition:background .15s;cursor:default;padding:0}
  .twk-toggle[data-on="1"]{background:#34c759}
  .twk-toggle i{position:absolute;top:2px;left:2px;width:14px;height:14px;border-radius:50%;
    background:#fff;box-shadow:0 1px 2px rgba(0,0,0,.25);transition:transform .15s}
  .twk-toggle[data-on="1"] i{transform:translateX(14px)}

  .twk-num{display:flex;align-items:center;box-sizing:border-box;min-width:0;height:26px;padding:0 0 0 8px;
    border:.5px solid rgba(0,0,0,.1);border-radius:7px;background:rgba(255,255,255,.6)}
  .twk-num-lbl{font-weight:500;color:rgba(41,38,27,.6);cursor:ew-resize;
    user-select:none;padding-right:8px}
  .twk-num input{flex:1;min-width:0;height:100%;border:0;background:transparent;
    font:inherit;font-variant-numeric:tabular-nums;text-align:right;padding:0 8px 0 0;
    outline:none;color:inherit;-moz-appearance:textfield}
  .twk-num input::-webkit-inner-spin-button,.twk-num input::-webkit-outer-spin-button{
    -webkit-appearance:none;margin:0}
  .twk-num-unit{padding-right:8px;color:rgba(41,38,27,.45)}

  .twk-btn{appearance:none;height:26px;padding:0 12px;border:0;border-radius:7px;
    background:rgba(0,0,0,.78);color:#fff;font:inherit;font-weight:500;cursor:default}
  .twk-btn:hover{background:rgba(0,0,0,.88)}
  .twk-btn.secondary{background:rgba(0,0,0,.06);color:inherit}
  .twk-btn.secondary:hover{background:rgba(0,0,0,.1)}

  .twk-swatch{appearance:none;-webkit-appearance:none;width:56px;height:22px;
    border:.5px solid rgba(0,0,0,.1);border-radius:6px;padding:0;cursor:default;
    background:transparent;flex-shrink:0}
  .twk-swatch::-webkit-color-swatch-wrapper{padding:0}
  .twk-swatch::-webkit-color-swatch{border:0;border-radius:5.5px}
  .twk-swatch::-moz-color-swatch{border:0;border-radius:5.5px}

  .twk-chips{display:flex;gap:6px}
  .twk-chip{position:relative;appearance:none;flex:1;min-width:0;height:46px;
    padding:0;border:0;border-radius:6px;overflow:hidden;cursor:default;
    box-shadow:0 0 0 .5px rgba(0,0,0,.12),0 1px 2px rgba(0,0,0,.06);
    transition:transform .12s cubic-bezier(.3,.7,.4,1),box-shadow .12s}
  .twk-chip:hover{transform:translateY(-1px);
    box-shadow:0 0 0 .5px rgba(0,0,0,.18),0 4px 10px rgba(0,0,0,.12)}
  .twk-chip[data-on="1"]{box-shadow:0 0 0 1.5px rgba(0,0,0,.85),
    0 2px 6px rgba(0,0,0,.15)}
  .twk-chip>span{position:absolute;top:0;bottom:0;right:0;width:34%;
    display:flex;flex-direction:column;box-shadow:-1px 0 0 rgba(0,0,0,.1)}
  .twk-chip>span>i{flex:1;box-shadow:0 -1px 0 rgba(0,0,0,.1)}
  .twk-chip>span>i:first-child{box-shadow:none}
  .twk-chip svg{position:absolute;top:6px;left:6px;width:13px;height:13px;
    filter:drop-shadow(0 1px 1px rgba(0,0,0,.3))}
`;

// ── useTweaks ───────────────────────────────────────────────────────────────
// Single source of truth for tweak values. setTweak persists via the host
// (__edit_mode_set_keys → host rewrites the EDITMODE block on disk).
function useTweaks(defaults) {
  const [values, setValues] = React.useState(defaults);
  // Accepts either setTweak('key', value) or setTweak({ key: value, ... }) so a
  // useState-style call doesn't write a "[object Object]" key into the persisted
  // JSON block.
  const setTweak = React.useCallback((keyOrEdits, val) => {
    const edits = typeof keyOrEdits === 'object' && keyOrEdits !== null
      ? keyOrEdits : { [keyOrEdits]: val };
    setValues((prev) => ({ ...prev, ...edits }));
    window.parent.postMessage({ type: '__edit_mode_set_keys', edits }, '*');
    // Same-window signal so in-page listeners (deck-stage rail thumbnails)
    // can react — the parent message only reaches the host, not peers.
    window.dispatchEvent(new CustomEvent('tweakchange', { detail: edits }));
  }, []);
  return [values, setTweak];
}

// ── TweaksPanel ─────────────────────────────────────────────────────────────
// Floating shell. Registers the protocol listener BEFORE announcing
// availability — if the announce ran first, the host's activate could land
// before our handler exists and the toolbar toggle would silently no-op.
// The close button posts __edit_mode_dismissed so the host's toolbar toggle
// flips off in lockstep; the host echoes __deactivate_edit_mode back which
// is what actually hides the panel.
function TweaksPanel({ title = 'Tweaks', children }) {
  const [open, setOpen] = React.useState(false);
  const dragRef = React.useRef(null);
  const offsetRef = React.useRef({ x: 16, y: 16 });
  const PAD = 16;

  const clampToViewport = React.useCallback(() => {
    const panel = dragRef.current;
    if (!panel) return;
    const w = panel.offsetWidth, h = panel.offsetHeight;
    const maxRight = Math.max(PAD, window.innerWidth - w - PAD);
    const maxBottom = Math.max(PAD, window.innerHeight - h - PAD);
    offsetRef.current = {
      x: Math.min(maxRight, Math.max(PAD, offsetRef.current.x)),
      y: Math.min(maxBottom, Math.max(PAD, offsetRef.current.y)),
    };
    panel.style.right = offsetRef.current.x + 'px';
    panel.style.bottom = offsetRef.current.y + 'px';
  }, []);

  React.useEffect(() => {
    if (!open) return;
    clampToViewport();
    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', clampToViewport);
      return () => window.removeEventListener('resize', clampToViewport);
    }
    const ro = new ResizeObserver(clampToViewport);
    ro.observe(document.documentElement);
    return () => ro.disconnect();
  }, [open, clampToViewport]);

  React.useEffect(() => {
    const onMsg = (e) => {
      const t = e?.data?.type;
      if (t === '__activate_edit_mode') setOpen(true);
      else if (t === '__deactivate_edit_mode') setOpen(false);
    };
    window.addEventListener('message', onMsg);
    window.parent.postMessage({ type: '__edit_mode_available' }, '*');
    return () => window.removeEventListener('message', onMsg);
  }, []);

  const dismiss = () => {
    setOpen(false);
    window.parent.postMessage({ type: '__edit_mode_dismissed' }, '*');
  };

  const onDragStart = (e) => {
    const panel = dragRef.current;
    if (!panel) return;
    const r = panel.getBoundingClientRect();
    const sx = e.clientX, sy = e.clientY;
    const startRight = window.innerWidth - r.right;
    const startBottom = window.innerHeight - r.bottom;
    const move = (ev) => {
      offsetRef.current = {
        x: startRight - (ev.clientX - sx),
        y: startBottom - (ev.clientY - sy),
      };
      clampToViewport();
    };
    const up = () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseup', up);
    };
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', up);
  };

  if (!open) return null;
  return (
    <>
      <style>{__TWEAKS_STYLE}</style>
      <div ref={dragRef} className="twk-panel" data-omelette-chrome=""
           style={{ right: offsetRef.current.x, bottom: offsetRef.current.y }}>
        <div className="twk-hd" onMouseDown={onDragStart}>
          <b>{title}</b>
          <button className="twk-x" aria-label="Close tweaks"
                  onMouseDown={(e) => e.stopPropagation()}
                  onClick={dismiss}>✕</button>
        </div>
        <div className="twk-body">
          {children}
        </div>
      </div>
    </>
  );
}

// ── Layout helpers ──────────────────────────────────────────────────────────

function TweakSection({ label, children }) {
  return (
    <>
      <div className="twk-sect">{label}</div>
      {children}
    </>
  );
}

function TweakRow({ label, value, children, inline = false }) {
  return (
    <div className={inline ? 'twk-row twk-row-h' : 'twk-row'}>
      <div className="twk-lbl">
        <span>{label}</span>
        {value != null && <span className="twk-val">{value}</span>}
      </div>
      {children}
    </div>
  );
}

// ── Controls ────────────────────────────────────────────────────────────────

function TweakSlider({ label, value, min = 0, max = 100, step = 1, unit = '', onChange }) {
  return (
    <TweakRow label={label} value={`${value}${unit}`}>
      <input type="range" className="twk-slider" min={min} max={max} step={step}
             value={value} onChange={(e) => onChange(Number(e.target.value))} />
    </TweakRow>
  );
}

function TweakToggle({ label, value, onChange }) {
  return (
    <div className="twk-row twk-row-h">
      <div className="twk-lbl"><span>{label}</span></div>
      <button type="button" className="twk-toggle" data-on={value ? '1' : '0'}
              role="switch" aria-checked={!!value}
              onClick={() => onChange(!value)}><i /></button>
    </div>
  );
}

function TweakRadio({ label, value, options, onChange }) {
  const trackRef = React.useRef(null);
  const [dragging, setDragging] = React.useState(false);
  // The active value is read by pointer-move handlers attached for the lifetime
  // of a drag — ref it so a stale closure doesn't fire onChange for every move.
  const valueRef = React.useRef(value);
  valueRef.current = value;

  // Segments wrap mid-word once per-segment width runs out. The track is
  // ~248px (280 panel − 28 body pad − 4 seg pad), each button loses 12px
  // to its own padding, and 11.5px system-ui averages ~6.3px/char — so 2
  // options fit ~16 chars each, 3 fit ~10. Past that (or >3 options), fall
  // back to a dropdown rather than wrap.
  const labelLen = (o) => String(typeof o === 'object' ? o.label : o).length;
  const maxLen = options.reduce((m, o) => Math.max(m, labelLen(o)), 0);
  const fitsAsSegments = maxLen <= ({ 2: 16, 3: 10 }[options.length] ?? 0);
  if (!fitsAsSegments) {
    // <select> emits strings — map back to the original option value so the
    // fallback stays type-preserving (numbers, booleans) like the segment path.
    const resolve = (s) => {
      const m = options.find((o) => String(typeof o === 'object' ? o.value : o) === s);
      return m === undefined ? s : typeof m === 'object' ? m.value : m;
    };
    return <TweakSelect label={label} value={value} options={options}
                        onChange={(s) => onChange(resolve(s))} />;
  }
  const opts = options.map((o) => (typeof o === 'object' ? o : { value: o, label: o }));
  const idx = Math.max(0, opts.findIndex((o) => o.value === value));
  const n = opts.length;

  const segAt = (clientX) => {
    const r = trackRef.current.getBoundingClientRect();
    const inner = r.width - 4;
    const i = Math.floor(((clientX - r.left - 2) / inner) * n);
    return opts[Math.max(0, Math.min(n - 1, i))].value;
  };

  const onPointerDown = (e) => {
    setDragging(true);
    const v0 = segAt(e.clientX);
    if (v0 !== valueRef.current) onChange(v0);
    const move = (ev) => {
      if (!trackRef.current) return;
      const v = segAt(ev.clientX);
      if (v !== valueRef.current) onChange(v);
    };
    const up = () => {
      setDragging(false);
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  };

  return (
    <TweakRow label={label}>
      <div ref={trackRef} role="radiogroup" onPointerDown={onPointerDown}
           className={dragging ? 'twk-seg dragging' : 'twk-seg'}>
        <div className="twk-seg-thumb"
             style={{ left: `calc(2px + ${idx} * (100% - 4px) / ${n})`,
                      width: `calc((100% - 4px) / ${n})` }} />
        {opts.map((o) => (
          <button key={o.value} type="button" role="radio" aria-checked={o.value === value}>
            {o.label}
          </button>
        ))}
      </div>
    </TweakRow>
  );
}

function TweakSelect({ label, value, options, onChange }) {
  return (
    <TweakRow label={label}>
      <select className="twk-field" value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((o) => {
          const v = typeof o === 'object' ? o.value : o;
          const l = typeof o === 'object' ? o.label : o;
          return <option key={v} value={v}>{l}</option>;
        })}
      </select>
    </TweakRow>
  );
}

function TweakText({ label, value, placeholder, onChange }) {
  return (
    <TweakRow label={label}>
      <input className="twk-field" type="text" value={value} placeholder={placeholder}
             onChange={(e) => onChange(e.target.value)} />
    </TweakRow>
  );
}

function TweakNumber({ label, value, min, max, step = 1, unit = '', onChange }) {
  const clamp = (n) => {
    if (min != null && n < min) return min;
    if (max != null && n > max) return max;
    return n;
  };
  const startRef = React.useRef({ x: 0, val: 0 });
  const onScrubStart = (e) => {
    e.preventDefault();
    startRef.current = { x: e.clientX, val: value };
    const decimals = (String(step).split('.')[1] || '').length;
    const move = (ev) => {
      const dx = ev.clientX - startRef.current.x;
      const raw = startRef.current.val + dx * step;
      const snapped = Math.round(raw / step) * step;
      onChange(clamp(Number(snapped.toFixed(decimals))));
    };
    const up = () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  };
  return (
    <div className="twk-num">
      <span className="twk-num-lbl" onPointerDown={onScrubStart}>{label}</span>
      <input type="number" value={value} min={min} max={max} step={step}
             onChange={(e) => onChange(clamp(Number(e.target.value)))} />
      {unit && <span className="twk-num-unit">{unit}</span>}
    </div>
  );
}

// Relative-luminance contrast pick — checkmarks drawn over a swatch need to
// read on both #111 and #fafafa without per-option configuration. Hex input
// only (#rgb / #rrggbb); named or rgb()/hsl() colors fall through to "light".
function __twkIsLight(hex) {
  const h = String(hex).replace('#', '');
  const x = h.length === 3 ? h.replace(/./g, (c) => c + c) : h.padEnd(6, '0');
  const n = parseInt(x.slice(0, 6), 16);
  if (Number.isNaN(n)) return true;
  const r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
  return r * 299 + g * 587 + b * 114 > 148000;
}

const __TwkCheck = ({ light }) => (
  <svg viewBox="0 0 14 14" aria-hidden="true">
    <path d="M3 7.2 5.8 10 11 4.2" fill="none" strokeWidth="2.2"
          strokeLinecap="round" strokeLinejoin="round"
          stroke={light ? 'rgba(0,0,0,.78)' : '#fff'} />
  </svg>
);

// TweakColor — curated color/palette picker. Each option is either a single
// hex string or an array of 1-5 hex strings; the card adapts — a lone color
// renders solid, a palette renders colors[0] as the hero (left ~2/3) with the
// rest stacked in a sharp column on the right. onChange emits the
// option in the shape it was passed (string stays string, array stays array).
// Without options it falls back to the native color input for back-compat.
function TweakColor({ label, value, options, onChange }) {
  if (!options || !options.length) {
    return (
      <div className="twk-row twk-row-h">
        <div className="twk-lbl"><span>{label}</span></div>
        <input type="color" className="twk-swatch" value={value}
               onChange={(e) => onChange(e.target.value)} />
      </div>
    );
  }
  // Native <input type=color> emits lowercase hex per the HTML spec, so
  // compare case-insensitively. String() guards JSON.stringify(undefined),
  // which returns the primitive undefined (no .toLowerCase).
  const key = (o) => String(JSON.stringify(o)).toLowerCase();
  const cur = key(value);
  return (
    <TweakRow label={label}>
      <div className="twk-chips" role="radiogroup">
        {options.map((o, i) => {
          const colors = Array.isArray(o) ? o : [o];
          const [hero, ...rest] = colors;
          const sup = rest.slice(0, 4);
          const on = key(o) === cur;
          return (
            <button key={i} type="button" className="twk-chip" role="radio"
                    aria-checked={on} data-on={on ? '1' : '0'}
                    aria-label={colors.join(', ')} title={colors.join(' · ')}
                    style={{ background: hero }}
                    onClick={() => onChange(o)}>
              {sup.length > 0 && (
                <span>
                  {sup.map((c, j) => <i key={j} style={{ background: c }} />)}
                </span>
              )}
              {on && <__TwkCheck light={__twkIsLight(hero)} />}
            </button>
          );
        })}
      </div>
    </TweakRow>
  );
}

function TweakButton({ label, onClick, secondary = false }) {
  return (
    <button type="button" className={secondary ? 'twk-btn secondary' : 'twk-btn'}
            onClick={onClick}>{label}</button>
  );
}



// Shared atomic components for Venom
const { useState, useEffect, useRef, useMemo, useCallback } = React;

// ─── Icons (inline, original geometric) ──────────────────────────────
function Icon({ name, size = 16, className = "", stroke = 1.6 }) {
  const s = size;
  const props = { width: s, height: s, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: stroke, strokeLinecap: "round", strokeLinejoin: "round", className };
  switch (name) {
    case "send": return <svg {...props}><path d="M5 12h14M13 6l6 6-6 6"/></svg>;
    case "mic": return <svg {...props}><rect x="9" y="3" width="6" height="12" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/></svg>;
    case "mic-off": return <svg {...props}><path d="M3 3l18 18M9 9v2a3 3 0 0 0 5.1 2.1M15 9.34V6a3 3 0 0 0-5.94-.6M5 11a7 7 0 0 0 .59 2.79M19 11a7 7 0 0 1-1.66 4.52M12 18v3"/></svg>;
    case "stop": return <svg {...props}><rect x="6" y="6" width="12" height="12" rx="2"/></svg>;
    case "plus": return <svg {...props}><path d="M12 5v14M5 12h14"/></svg>;
    case "search": return <svg {...props}><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>;
    case "settings": return <svg {...props}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></svg>;
    case "trash": return <svg {...props}><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>;
    case "menu": return <svg {...props}><path d="M4 6h16M4 12h16M4 18h16"/></svg>;
    case "github": return <svg {...props} fill="currentColor" stroke="none"><path d="M12 .5C5.6.5.5 5.6.5 12c0 5 3.3 9.3 7.9 10.8.6.1.8-.3.8-.6v-2c-3.2.7-3.9-1.5-3.9-1.5-.5-1.3-1.3-1.7-1.3-1.7-1-.7.1-.7.1-.7 1.1.1 1.7 1.2 1.7 1.2 1 1.8 2.7 1.3 3.4 1 .1-.8.4-1.3.7-1.6-2.6-.3-5.3-1.3-5.3-5.8 0-1.3.5-2.3 1.2-3.2-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.2 1.2.9-.3 1.9-.4 2.9-.4s2 .1 2.9.4c2.2-1.5 3.2-1.2 3.2-1.2.6 1.6.2 2.8.1 3.1.8.8 1.2 1.9 1.2 3.2 0 4.5-2.7 5.5-5.3 5.8.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6 4.6-1.5 7.9-5.8 7.9-10.8C23.5 5.6 18.4.5 12 .5z"/></svg>;
    case "cloud": return <svg {...props}><path d="M17.5 19a4.5 4.5 0 0 0 .9-8.9 6 6 0 0 0-11.7 1.4A4 4 0 0 0 7 19h10.5z"/></svg>;
    case "chip": return <svg {...props}><rect x="5" y="5" width="14" height="14" rx="2"/><path d="M9 9h6v6H9zM9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 15h3M1 9h3M1 15h3"/></svg>;
    case "shield": return <svg {...props}><path d="M12 2 4 5v7c0 5 3.5 8.5 8 10 4.5-1.5 8-5 8-10V5l-8-3z"/></svg>;
    case "wave": return <svg {...props}><path d="M3 12h2l2-7 3 14 3-10 2 6 2-3h4"/></svg>;
    case "brain": return <svg {...props}><path d="M9 3a3 3 0 0 0-3 3 3 3 0 0 0-2 5 3 3 0 0 0 1 4 3 3 0 0 0 4 4 3 3 0 0 0 3 1V3zM15 3a3 3 0 0 1 3 3 3 3 0 0 1 2 5 3 3 0 0 1-1 4 3 3 0 0 1-4 4 3 3 0 0 1-3 1"/></svg>;
    case "globe": return <svg {...props}><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/></svg>;
    case "command": return <svg {...props}><path d="M9 6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6z"/></svg>;
    case "chevron-down": return <svg {...props}><path d="m6 9 6 6 6-6"/></svg>;
    case "chevron-right": return <svg {...props}><path d="m9 6 6 6-6 6"/></svg>;
    case "copy": return <svg {...props}><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/></svg>;
    case "check": return <svg {...props}><path d="m5 12 5 5L20 7"/></svg>;
    case "x": return <svg {...props}><path d="M6 6l12 12M18 6 6 18"/></svg>;
    case "arrow-right": return <svg {...props}><path d="M5 12h14M13 6l6 6-6 6"/></svg>;
    case "sparkle": return <svg {...props}><path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M5.6 18.4l2.8-2.8M15.6 8.4l2.8-2.8"/></svg>;
    case "thunder": return <svg {...props} fill="currentColor" stroke="none"><path d="M13 2 4 14h6l-1 8 9-12h-6l1-8z"/></svg>;
    case "pause": return <svg {...props}><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></svg>;
    case "play": return <svg {...props}><path d="M6 4l14 8-14 8V4z" fill="currentColor"/></svg>;
    default: return null;
  }
}

// ─── Brand mark: wordmark with thunder glyph ─────────────────────────
function VenomMark({ size = 28 }) {
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
      <span style={{
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        width: size, height: size,
        borderRadius: 8,
        background: "linear-gradient(135deg, var(--accent), oklch(0.55 0.2 320))",
        boxShadow: "0 0 0 1px var(--border-strong), 0 6px 18px -6px var(--accent-glow)",
      }}>
        <Icon name="thunder" size={size * 0.55} className="" />
      </span>
      <span style={{
        fontFamily: "var(--font-sans)",
        fontWeight: 700,
        letterSpacing: "0.18em",
        fontSize: size * 0.55,
      }}>VENOM</span>
    </div>
  );
}

// ─── Pill / Badge ────────────────────────────────────────────────────
function Pill({ children, tone = "default", style = {} }) {
  const dotClass = tone === "purple" ? "dot purple" : tone === "warn" ? "dot warn" : "dot";
  return (
    <span className="pill" style={style}>
      <span className={dotClass} />
      {children}
    </span>
  );
}

// ─── Code block w/ tabs ──────────────────────────────────────────────
function CodeBlock({ tabs, activeTab, onTab, lines }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    const text = lines.map(l => l.map(t => t.text).join("")).join("\n");
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  };
  return (
    <div style={{
      border: "1px solid var(--border)",
      background: "oklch(0.12 0.012 280 / 0.7)",
      backdropFilter: "blur(10px)",
      borderRadius: "var(--radius-lg)",
      overflow: "hidden",
      fontFamily: "var(--font-mono)",
      fontSize: 13,
    }}>
      <div style={{ display: "flex", borderBottom: "1px solid var(--border)", paddingLeft: 8 }}>
        {tabs.map(t => (
          <button key={t} onClick={() => onTab(t)} style={{
            padding: "10px 14px",
            fontFamily: "var(--font-mono)",
            fontSize: 12,
            letterSpacing: "0.05em",
            color: activeTab === t ? "var(--accent)" : "var(--text-muted)",
            borderBottom: activeTab === t ? "1px solid var(--accent)" : "1px solid transparent",
            marginBottom: -1,
          }}>{t}</button>
        ))}
        <div style={{ flex: 1 }} />
        <button onClick={copy} title="Copy" style={{
          padding: "0 14px", color: "var(--text-muted)",
        }}>
          <Icon name={copied ? "check" : "copy"} size={14} />
        </button>
      </div>
      <div style={{ padding: "14px 16px", lineHeight: 1.7 }}>
        {lines.map((line, i) => (
          <div key={i}>
            {line.map((tok, j) => (
              <span key={j} style={{ color: tok.color || "var(--text-dim)" }}>{tok.text}</span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Voice waveform ──────────────────────────────────────────────────
function Waveform({ active = false, bars = 24, color = "var(--accent)" }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 3, height: 28 }}>
      {Array.from({ length: bars }).map((_, i) => (
        <span key={i} style={{
          display: "inline-block",
          width: 3,
          height: 18,
          borderRadius: 2,
          background: color,
          opacity: active ? 0.9 : 0.25,
          transformOrigin: "center",
          animation: active ? `wave-bar ${0.6 + (i % 5) * 0.12}s ease-in-out ${i * 0.03}s infinite` : "none",
        }} />
      ))}
    </div>
  );
}

// ─── Loading dots ────────────────────────────────────────────────────
function ThinkingDots() {
  return (
    <span style={{ display: "inline-flex", gap: 4 }}>
      {[0,1,2].map(i => (
        <span key={i} style={{
          width: 5, height: 5, borderRadius: "50%",
          background: "var(--accent)",
          animation: `pulse-dot 1.2s ease-in-out ${i * 0.2}s infinite`,
        }} />
      ))}
    </span>
  );
}

// Export to window


// Venom landing screen
const { useState: useStateL, useEffect: useEffectL } = React;

function Landing({ onLaunch }) {
  const [pkgTab, setPkgTab] = useStateL("pip");
  const lines = {
    pip: [[{ text: "$ ", color: "var(--accent)" }, { text: "pip install ", color: "var(--text)" }, { text: "venom-ai", color: "var(--accent-bright)" }]],
    docker: [[{ text: "$ ", color: "var(--accent)" }, { text: "docker run ", color: "var(--text)" }, { text: "venom/runtime:latest", color: "var(--accent-bright)" }]],
    curl: [[{ text: "$ ", color: "var(--accent)" }, { text: "curl -fsSL ", color: "var(--text)" }, { text: "venom.sh ", color: "var(--accent-bright)" }, { text: "| sh", color: "var(--text)" }]],
    ollama: [[{ text: "$ ", color: "var(--accent)" }, { text: "ollama pull ", color: "var(--text)" }, { text: "venom:8b", color: "var(--accent-bright)" }]],
  };

  return (
    <div style={{ position: "relative", height: "100%", width: "100%", overflow: "auto" }}>
      <div className="grid-bg" />
      <div className="glow-bg" />

      {/* Top nav */}
      <nav style={{
        position: "relative",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "20px 40px",
        borderBottom: "1px solid var(--border)",
        backdropFilter: "blur(8px)",
        background: "oklch(0.13 0.012 280 / 0.5)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
          <VenomMark size={28} />
          <span className="pill" style={{ fontSize: 10 }}>
            <span className="dot purple" />v0.9 · public alpha
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 28, fontSize: 14, color: "var(--text-dim)" }}>
          <a style={{ cursor: "pointer" }}>Docs</a>
          <a style={{ cursor: "pointer" }}>Models</a>
          <a style={{ cursor: "pointer" }}>Personalities</a>
          <a style={{ cursor: "pointer" }}>Changelog</a>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "6px 12px", borderRadius: 8,
            border: "1px solid var(--border-strong)",
            background: "var(--surface)",
            fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text-muted)",
          }}>
            <Icon name="search" size={13} /> Search
            <span style={{
              padding: "1px 6px", border: "1px solid var(--border)", borderRadius: 4, fontSize: 10,
            }}>⌘K</span>
          </div>
          <a style={{ cursor: "pointer", color: "var(--text-dim)" }}><Icon name="github" size={18} /></a>
        </div>
      </nav>

      {/* Hero */}
      <main style={{
        position: "relative",
        display: "grid",
        gridTemplateColumns: "1.05fr 1fr",
        gap: 60,
        padding: "70px 80px 40px",
        maxWidth: 1400,
        margin: "0 auto",
      }}>
        {/* Left column */}
        <div>
          <div className="fade-up" style={{
            display: "inline-flex", alignItems: "center", gap: 10,
            padding: "5px 12px 5px 5px",
            borderRadius: 999,
            border: "1px solid var(--border-strong)",
            background: "oklch(0.18 0.02 295 / 0.4)",
            fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.04em",
            color: "var(--text-dim)",
          }}>
            <span style={{
              padding: "2px 8px", borderRadius: 999,
              background: "var(--accent)", color: "var(--bg)",
              fontSize: 10, fontWeight: 700, letterSpacing: "0.08em",
            }}>NEW</span>
            HYBRID INFERENCE · CLOUD + LOCAL · v0.9
          </div>

          <h1 className="fade-up-d1" style={{
            fontSize: 76,
            fontWeight: 600,
            lineHeight: 1.02,
            letterSpacing: "-0.03em",
            margin: "28px 0 0",
            textWrap: "balance",
          }}>
            The personality-<br/>driven AI <span style={{
              background: "linear-gradient(135deg, var(--accent-bright), oklch(0.7 0.2 320))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontStyle: "italic",
              fontWeight: 500,
            }}>operating&nbsp;layer</span>.
          </h1>

          <p className="fade-up-d2" style={{
            fontSize: 17, lineHeight: 1.6,
            color: "var(--text-dim)",
            margin: "26px 0 0",
            maxWidth: 520,
          }}>
            Venom routes between cloud frontier models and on-device inference, remembers
            what matters, and answers in a voice you actually want to hear. Built for the
            command line, the keyboard, and the microphone.
          </p>

          {/* CTA row */}
          <div className="fade-up-d3" style={{ display: "flex", gap: 12, marginTop: 36 }}>
            <button className="btn btn-primary" onClick={onLaunch}>
              Launch Venom <Icon name="arrow-right" size={14} />
            </button>
            <button className="btn">
              <Icon name="github" size={14} /> View on GitHub
            </button>
            <button className="btn btn-ghost">
              Read the docs <Icon name="chevron-right" size={14} />
            </button>
          </div>

          {/* Code block */}
          <div className="fade-up-d4" style={{ marginTop: 44, maxWidth: 560 }}>
            <CodeBlock
              tabs={["pip", "docker", "curl", "ollama"]}
              activeTab={pkgTab}
              onTab={setPkgTab}
              lines={lines[pkgTab]}
            />
          </div>

          {/* Stat bar */}
          <div className="fade-up-d4" style={{
            display: "flex", gap: 28, marginTop: 36,
            paddingTop: 28, borderTop: "1px solid var(--border)",
            maxWidth: 560,
          }}>
            {[
              ["~38ms", "first token, local"],
              ["12+", "open-weight models"],
              ["4", "personality cores"],
              ["100%", "offline-capable"],
            ].map(([n, l]) => (
              <div key={l} style={{ minWidth: 0 }}>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 22, color: "var(--text)" }}>{n}</div>
                <div style={{ fontSize: 11, color: "var(--text-muted)", letterSpacing: "0.04em", textTransform: "uppercase", marginTop: 4 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: hero panel */}
        <div className="fade-up-d2" style={{ position: "relative" }}>
          <HeroPanel />
        </div>
      </main>

      {/* Trusted strip */}
      <section style={{
        position: "relative",
        borderTop: "1px solid var(--border)",
        padding: "28px 80px 40px",
        maxWidth: 1400, margin: "40px auto 0",
      }}>
        <div style={{
          fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.1em",
          textTransform: "uppercase", color: "var(--text-muted)",
        }}>
          ── Powered by · runs on · plays nice with
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 56, marginTop: 22, flexWrap: "wrap", color: "var(--text-dim)", fontWeight: 500, fontSize: 16, letterSpacing: "0.02em" }}>
          {["OpenRouter", "Ollama", "Whisper", "FastAPI", "Next.js", "llama.cpp"].map(s => (
            <span key={s} style={{ opacity: 0.7 }}>{s}</span>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        position: "relative",
        padding: "30px 80px 24px",
        maxWidth: 1400, margin: "0 auto",
        display: "flex", justifyContent: "space-between",
        fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-muted)",
        letterSpacing: "0.04em",
      }}>
        <span>venom v0.9.2 · build 0xA94F · {new Date().getFullYear()} the venom collective</span>
        <span>licensed under apache-2.0 · privacy · status ●</span>
      </footer>
    </div>
  );
}

// Right-side hero panel: a stylised "system bus" / live readout
function HeroPanel() {
  const [tick, setTick] = useStateL(0);
  useEffectL(() => {
    const id = setInterval(() => setTick(t => t + 1), 1200);
    return () => clearInterval(id);
  }, []);

  return (
    <div style={{
      position: "relative",
      border: "1px solid var(--border-strong)",
      borderRadius: 16,
      background: "oklch(0.12 0.012 280 / 0.7)",
      backdropFilter: "blur(8px)",
      padding: 18,
      height: 560,
      display: "flex", flexDirection: "column", gap: 14,
      boxShadow: "0 0 0 1px var(--accent-glow), 0 30px 80px -40px var(--accent-glow)",
      overflow: "hidden",
    }}>
      {/* corner brackets */}
      {["tl","tr","bl","br"].map((c, i) => {
        const pos = { tl:{top:8,left:8}, tr:{top:8,right:8}, bl:{bottom:8,left:8}, br:{bottom:8,right:8} }[c];
        const borders = {
          tl: { borderTop: "1px solid var(--accent)", borderLeft: "1px solid var(--accent)" },
          tr: { borderTop: "1px solid var(--accent)", borderRight: "1px solid var(--accent)" },
          bl: { borderBottom: "1px solid var(--accent)", borderLeft: "1px solid var(--accent)" },
          br: { borderBottom: "1px solid var(--accent)", borderRight: "1px solid var(--accent)" },
        }[c];
        return <span key={c} style={{ position: "absolute", width: 14, height: 14, opacity: 0.7, ...pos, ...borders }} />;
      })}

      {/* Panel header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.1em", color: "var(--text-muted)" }}>
          VENOM://CORE.RUNTIME
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <Pill tone="purple">cloud · openrouter</Pill>
          <Pill>local · ollama</Pill>
        </div>
      </div>

      {/* Big logo plate */}
      <div style={{
        flex: 1,
        position: "relative",
        borderRadius: 12,
        border: "1px solid var(--border)",
        background: "radial-gradient(ellipse at center, oklch(0.2 0.03 295 / 0.5), oklch(0.1 0.01 280) 70%)",
        display: "flex", alignItems: "center", justifyContent: "center",
        overflow: "hidden",
      }}>
        {/* concentric rings */}
        {[1,2,3,4].map(i => (
          <div key={i} style={{
            position: "absolute",
            width: 120 + i*70, height: 120 + i*70,
            borderRadius: "50%",
            border: "1px solid var(--border)",
            opacity: 0.6 - i*0.1,
          }} />
        ))}
        {/* orbiting dot */}
        <div style={{
          position: "absolute",
          width: 260, height: 260,
          animation: "spin 18s linear infinite",
        }}>
          <span style={{
            position: "absolute", top: -3, left: "50%",
            width: 6, height: 6, borderRadius: "50%",
            background: "var(--accent)", boxShadow: "0 0 12px var(--accent)",
          }} />
        </div>
        <img src="assets/venom-logo.png" alt="Venom" style={{
          width: 220, height: 220, objectFit: "contain",
          filter: "drop-shadow(0 0 30px var(--accent-glow))",
          position: "relative", zIndex: 1,
        }} />
      </div>

      {/* Bottom telemetry strip */}
      <div style={{
        display: "grid", gridTemplateColumns: "1fr 1fr 1fr",
        gap: 10,
        fontFamily: "var(--font-mono)", fontSize: 11,
      }}>
        <TelemetryRow label="ROUTER" value={tick % 3 === 0 ? "→ local · llama-3" : "→ cloud · claude-haiku-4"} />
        <TelemetryRow label="LATENCY" value={`${36 + (tick % 7)}ms`} />
        <TelemetryRow label="MEMORY" value={`${42 + (tick % 3)} entries`} />
        <TelemetryRow label="VOICE" value="whisper-v3 · idle" />
        <TelemetryRow label="MODE" value="hybrid · adaptive" accent />
        <TelemetryRow label="UPLINK" value="●  ok" ok />
      </div>
    </div>
  );
}

function TelemetryRow({ label, value, accent, ok }) {
  return (
    <div style={{
      padding: "8px 10px",
      borderRadius: 8,
      border: "1px solid var(--border)",
      background: "oklch(0.16 0.014 280 / 0.7)",
      display: "flex", justifyContent: "space-between", alignItems: "center",
      gap: 8, minWidth: 0,
    }}>
      <span style={{ color: "var(--text-muted)", letterSpacing: "0.06em" }}>{label}</span>
      <span style={{
        color: accent ? "var(--accent-bright)" : ok ? "var(--ok)" : "var(--text)",
        overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
      }}>{value}</span>
    </div>
  );
}


// Venom — main chat app
const { useState: useStateA, useEffect: useEffectA, useRef: useRefA, useMemo: useMemoA, useCallback: useCallbackA } = React;

const PERSONALITIES = {
  sarcastic: { name: "Sarcastic", tag: "venom.core", color: "oklch(0.7 0.22 295)",
    desc: "Dry, sharp, allergic to small talk.",
    opener: "Oh hey, another genius with a question. Hit me." },
  friendly: { name: "Friendly", tag: "warm.core", color: "oklch(0.78 0.16 75)",
    desc: "Encouraging, casual, your best teammate.",
    opener: "Hey! Glad you're here. What are we figuring out today?" },
  professional: { name: "Professional", tag: "exec.core", color: "oklch(0.8 0.12 200)",
    desc: "Precise, formal, ready for execs.",
    opener: "Good day. How may I assist with your workflow this morning?" },
  chaos: { name: "Chaos", tag: "rogue.core", color: "oklch(0.7 0.25 25)",
    desc: "Maximum entropy. You asked for this.",
    opener: "WAKE UP SAMURAI WE'VE GOT A QUESTION TO ANSWER. or whatever. fire it." },
};

const PROVIDERS = {
  cloud:  { label: "Cloud",  sub: "OpenRouter",        models: ["claude-haiku-4-5", "gpt-5o", "gemini-flash-2.5", "deepseek-r2", "llama-405b"] },
  local:  { label: "Local",  sub: "Ollama · on-device", models: ["llama-3.1-8b", "qwen-2.5-7b", "mistral-nemo", "phi-4-mini"] },
  hybrid: { label: "Hybrid", sub: "Auto-routed",       models: ["adaptive"] },
};

// Sample conversation seed data
const SEED_CHATS = [
  { id: "c1", title: "Refactor the auth middleware", preview: "Let me read the new express route…", time: "12:08", pinned: true,
    messages: [
      { role: "user", text: "Refactor the auth middleware — it's a mess and the JWT verify is duplicated 3 places." },
      { role: "assistant", text: "Three duplicates, classic. Pull the verify into `lib/auth/verifyJwt.ts`, export a single `requireUser(req)` helper, and replace the three call sites with that. Want me to draft the file?" },
      { role: "user", text: "yes please" },
      { role: "assistant", text: "Drafting. Quick clarifier — should the helper *throw* on bad token (cleanest) or return `{ user, error }`? Different blast radius." },
    ] },
  { id: "c2", title: "Italian phrases for Rome trip", preview: "Sure — start with these 12 high-leverage ones…", time: "Yesterday",
    messages: [
      { role: "user", text: "I'm going to Rome next week. Give me 12 phrases that punch above their weight." },
      { role: "assistant", text: "Twelve, ranked by ROI:\n\n1. *Un caffè, per favore.* — espresso, polite, instantly Italian.\n2. *Scusi, dov'è…?* — excuse me, where is…?\n3. *Vorrei…* — I would like… (use everywhere)\n4. *Quanto costa?* — how much?\n5. *Il conto, grazie.* — the check, thanks.\n…want the other seven?" },
    ] },
  { id: "c3", title: "Why is my Postgres slow", preview: "First check: do you have an index on…", time: "Yesterday",
    messages: [
      { role: "user", text: "Why is my Postgres query slow? It's a join across 4 tables." },
      { role: "assistant", text: "EXPLAIN ANALYZE it and paste the plan — guessing without it is astrology. But the usual suspects: missing index on the join keys, sequential scan on a big table, or a bad join order from outdated stats. Run `ANALYZE` recently?" },
    ] },
  { id: "c4", title: "Weekend recipe — orecchiette", preview: "Toast the breadcrumbs first…", time: "Sat" },
  { id: "c5", title: "OKRs for Q2", preview: "Three objectives, four KRs each…", time: "Apr 18" },
];

// ─── Sidebar ─────────────────────────────────────────────────────────
function Sidebar({ chats, activeId, onSelect, onNew, onDelete, personality, setPersonality, onHome }) {
  return (
    <aside style={{
      width: 280,
      borderRight: "1px solid var(--border)",
      background: "oklch(0.115 0.012 280 / 0.85)",
      backdropFilter: "blur(10px)",
      display: "flex", flexDirection: "column",
      flexShrink: 0,
    }}>
      <div style={{ padding: "18px 16px 14px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <button onClick={onHome} style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
          <VenomMark size={22} />
        </button>
        <Pill tone="purple" style={{ fontSize: 9 }}>v0.9</Pill>
      </div>

      <div style={{ padding: "0 12px 12px", display: "flex", gap: 8 }}>
        <button className="btn btn-primary" style={{ flex: 1, justifyContent: "center", padding: "9px 12px", fontSize: 13 }} onClick={onNew}>
          <Icon name="plus" size={14} /> New chat
        </button>
        <button className="btn" style={{ padding: "9px 10px" }} title="Search">
          <Icon name="search" size={14} />
        </button>
      </div>

      <div style={{
        padding: "8px 16px 6px",
        fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.1em",
        color: "var(--text-muted)", textTransform: "uppercase",
      }}>Conversations</div>

      <div style={{ flex: 1, overflow: "auto", padding: "0 8px" }}>
        {chats.map(c => {
          const active = c.id === activeId;
          return (
            <button key={c.id} onClick={() => onSelect(c.id)} style={{
              width: "100%", textAlign: "left", display: "block",
              padding: "10px 12px",
              borderRadius: 8,
              marginBottom: 2,
              background: active ? "oklch(0.2 0.04 295 / 0.6)" : "transparent",
              border: active ? "1px solid var(--accent-dim)" : "1px solid transparent",
              position: "relative",
            }}>
              <div style={{
                fontSize: 13, fontWeight: 500,
                color: active ? "var(--text)" : "var(--text-dim)",
                whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                display: "flex", alignItems: "center", gap: 6,
              }}>
                {c.pinned && <span style={{ width: 4, height: 4, borderRadius: "50%", background: "var(--accent)", flexShrink: 0 }} />}
                {c.title}
              </div>
              <div style={{
                fontSize: 11, color: "var(--text-muted)",
                whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                marginTop: 2, fontFamily: "var(--font-mono)",
              }}>{c.time} · {c.preview || "…"}</div>
            </button>
          );
        })}
      </div>

      {/* Personality switcher */}
      <div style={{ padding: "12px 12px", borderTop: "1px solid var(--border)" }}>
        <div style={{
          fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.1em",
          color: "var(--text-muted)", textTransform: "uppercase", marginBottom: 8,
        }}>Personality core</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
          {Object.entries(PERSONALITIES).map(([k, p]) => {
            const active = personality === k;
            return (
              <button key={k} onClick={() => setPersonality(k)} style={{
                padding: "8px 10px",
                borderRadius: 8,
                border: active ? `1px solid ${p.color}` : "1px solid var(--border)",
                background: active ? `color-mix(in oklch, ${p.color} 12%, transparent)` : "transparent",
                textAlign: "left",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: p.color, boxShadow: active ? `0 0 8px ${p.color}` : "none" }} />
                  <span style={{ fontSize: 12, fontWeight: 500, color: active ? "var(--text)" : "var(--text-dim)" }}>{p.name}</span>
                </div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "var(--text-muted)", marginTop: 4, letterSpacing: "0.04em" }}>{p.tag}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* User footer */}
      <div style={{
        padding: "10px 14px", borderTop: "1px solid var(--border)",
        display: "flex", alignItems: "center", gap: 10,
      }}>
        <div style={{
          width: 28, height: 28, borderRadius: 7,
          background: "linear-gradient(135deg, var(--accent), oklch(0.55 0.2 320))",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontWeight: 700, fontSize: 12, color: "var(--bg)",
        }}>M</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 12, fontWeight: 500 }}>maya</div>
          <div style={{ fontSize: 10, color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>pro · local-first</div>
        </div>
        <button className="btn btn-ghost" style={{ padding: 6 }} title="Settings">
          <Icon name="settings" size={14} />
        </button>
      </div>
    </aside>
  );
}

// ─── Top bar inside chat ─────────────────────────────────────────────
function TopBar({ provider, setProvider, model, setModel, modelOpen, setModelOpen, voiceState, onToggleVoice, privacy, setPrivacy }) {
  return (
    <header style={{
      display: "flex", alignItems: "center", gap: 14,
      padding: "12px 22px",
      borderBottom: "1px solid var(--border)",
      background: "oklch(0.13 0.012 280 / 0.7)",
      backdropFilter: "blur(8px)",
      flexShrink: 0,
    }}>
      {/* Provider toggle */}
      <div style={{
        display: "inline-flex",
        padding: 3,
        borderRadius: 8,
        border: "1px solid var(--border-strong)",
        background: "var(--surface)",
      }}>
        {Object.entries(PROVIDERS).map(([k, p]) => (
          <button key={k} onClick={() => setProvider(k)} style={{
            padding: "6px 12px",
            borderRadius: 6,
            fontSize: 12, fontWeight: 500,
            background: provider === k ? "var(--accent)" : "transparent",
            color: provider === k ? "var(--bg)" : "var(--text-dim)",
            display: "inline-flex", alignItems: "center", gap: 6,
          }}>
            <Icon name={k === "cloud" ? "cloud" : k === "local" ? "chip" : "sparkle"} size={12} />
            {p.label}
          </button>
        ))}
      </div>

      {/* Model dropdown */}
      <div style={{ position: "relative" }}>
        <button onClick={() => setModelOpen(o => !o)} className="btn" style={{ padding: "7px 12px", fontSize: 12, fontFamily: "var(--font-mono)" }}>
          <span style={{ color: "var(--text-muted)" }}>model:</span>
          <span style={{ color: "var(--accent-bright)" }}>{model}</span>
          <Icon name="chevron-down" size={12} />
        </button>
        {modelOpen && (
          <div style={{
            position: "absolute", top: "calc(100% + 6px)", left: 0,
            minWidth: 240, zIndex: 30,
            border: "1px solid var(--border-strong)",
            background: "var(--surface-solid)",
            borderRadius: 10, padding: 6,
            boxShadow: "0 20px 60px -10px black",
          }}>
            <div style={{ padding: "6px 8px", fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.1em", color: "var(--text-muted)", textTransform: "uppercase" }}>
              {PROVIDERS[provider].sub}
            </div>
            {PROVIDERS[provider].models.map(m => (
              <button key={m} onClick={() => { setModel(m); setModelOpen(false); }} style={{
                width: "100%", textAlign: "left",
                padding: "8px 10px", borderRadius: 6,
                fontFamily: "var(--font-mono)", fontSize: 12,
                color: m === model ? "var(--accent-bright)" : "var(--text-dim)",
                background: m === model ? "oklch(0.2 0.04 295 / 0.5)" : "transparent",
                display: "flex", alignItems: "center", gap: 8,
              }} onMouseEnter={e => { if (m !== model) e.currentTarget.style.background = "oklch(0.2 0.02 280 / 0.6)"; }}
                 onMouseLeave={e => { if (m !== model) e.currentTarget.style.background = "transparent"; }}>
                {m}
                {m === model && <Icon name="check" size={12} style={{ marginLeft: "auto" }} />}
              </button>
            ))}
          </div>
        )}
      </div>

      <div style={{ flex: 1 }} />

      <button onClick={() => setPrivacy(!privacy)} className="btn" style={{
        padding: "7px 12px", fontSize: 12,
        borderColor: privacy ? "var(--ok)" : "var(--border-strong)",
        color: privacy ? "var(--ok)" : "var(--text-dim)",
      }} title="Privacy mode — pin to local-only">
        <Icon name="shield" size={13} /> Privacy {privacy ? "on" : "off"}
      </button>

      <button onClick={onToggleVoice} className="btn" style={{
        padding: "7px 12px", fontSize: 12,
        borderColor: voiceState !== "off" ? "var(--accent)" : "var(--border-strong)",
        color: voiceState !== "off" ? "var(--accent-bright)" : "var(--text-dim)",
      }}>
        <Icon name={voiceState === "off" ? "mic-off" : "mic"} size={13} />
        Voice {voiceState !== "off" ? "live" : "off"}
      </button>

      <Pill><span className="dot" /> sync ok · ↑38ms</Pill>
    </header>
  );
}

// ─── Message bubble ──────────────────────────────────────────────────
function Message({ msg, personality, isLast, streaming }) {
  const p = PERSONALITIES[personality];
  if (msg.role === "user") {
    return (
      <div style={{ display: "flex", justifyContent: "flex-end", padding: "8px 0" }}>
        <div style={{
          maxWidth: "70%",
          padding: "10px 14px",
          borderRadius: "14px 14px 4px 14px",
          background: "oklch(0.22 0.025 280)",
          border: "1px solid var(--border-strong)",
          fontSize: 14, lineHeight: 1.55,
          whiteSpace: "pre-wrap",
        }}>{msg.text}</div>
      </div>
    );
  }
  return (
    <div style={{ display: "flex", gap: 12, padding: "12px 0", alignItems: "flex-start" }}>
      <div style={{
        width: 28, height: 28, borderRadius: 8, flexShrink: 0,
        background: `linear-gradient(135deg, ${p.color}, oklch(0.5 0.2 295))`,
        display: "flex", alignItems: "center", justifyContent: "center",
        boxShadow: `0 0 16px -4px ${p.color}`,
      }}>
        <Icon name="thunder" size={14} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
          <span style={{ fontWeight: 600, fontSize: 13 }}>Venom</span>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-muted)", letterSpacing: "0.04em" }}>
            · {p.tag} · {msg.model || "claude-haiku-4-5"} · {msg.provider || "cloud"}
          </span>
        </div>
        <div style={{
          fontSize: 14, lineHeight: 1.65, color: "var(--text)",
          whiteSpace: "pre-wrap",
        }}>
          {msg.text}
          {streaming && isLast && <span className="caret" />}
        </div>
        {!streaming && msg.role === "assistant" && (
          <div style={{ display: "flex", gap: 4, marginTop: 8 }}>
            {["copy", "thunder"].map(i => (
              <button key={i} className="btn btn-ghost" style={{ padding: "4px 8px", fontSize: 11 }}>
                <Icon name={i} size={11} /> {i === "copy" ? "Copy" : "Regenerate"}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Composer ────────────────────────────────────────────────────────
function Composer({ onSend, onVoice, voiceState, busy, suggestions, onSuggest }) {
  const [value, setValue] = useStateA("");
  const ref = useRefA(null);
  const submit = () => {
    const v = value.trim();
    if (!v || busy) return;
    onSend(v); setValue("");
  };
  return (
    <div style={{ padding: "14px 22px 20px" }}>
      {suggestions && suggestions.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 10 }}>
          {suggestions.map(s => (
            <button key={s} onClick={() => onSuggest(s)} className="btn" style={{ padding: "5px 10px", fontSize: 11, fontFamily: "var(--font-mono)", borderRadius: 999 }}>
              {s}
            </button>
          ))}
        </div>
      )}
      <div style={{
        display: "flex", alignItems: "flex-end", gap: 10,
        padding: 10,
        border: "1px solid var(--border-strong)",
        borderRadius: 14,
        background: "oklch(0.16 0.014 280 / 0.7)",
        backdropFilter: "blur(6px)",
        boxShadow: value ? "0 0 0 1px var(--accent-glow)" : "none",
        transition: "box-shadow 0.2s",
      }}>
        <button onClick={onVoice} title="Voice" style={{
          width: 36, height: 36, borderRadius: 9,
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          background: voiceState === "listening" ? "var(--accent)" : "transparent",
          color: voiceState === "listening" ? "var(--bg)" : "var(--text-dim)",
          border: voiceState === "listening" ? "1px solid var(--accent-bright)" : "1px solid var(--border)",
          animation: voiceState === "listening" ? "glow-pulse 1.6s ease-in-out infinite" : "none",
        }}>
          <Icon name={voiceState === "off" ? "mic-off" : "mic"} size={15} />
        </button>
        <textarea
          ref={ref}
          value={value}
          onChange={e => setValue(e.target.value)}
          onKeyDown={e => {
            if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); submit(); }
          }}
          rows={1}
          placeholder='Ask Venom… or say "Hey Venom"'
          style={{
            flex: 1, resize: "none", border: "none", outline: "none",
            background: "transparent", color: "var(--text)",
            fontSize: 14, lineHeight: 1.5, padding: "8px 4px",
            maxHeight: 160, minHeight: 24,
          }}
        />
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-muted)" }}>
            ↵ send · ⇧↵ newline
          </span>
          <button onClick={submit} disabled={!value.trim() || busy} className="btn btn-primary" style={{
            padding: "8px 10px",
            opacity: !value.trim() || busy ? 0.4 : 1,
          }}>
            <Icon name="send" size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Voice overlay (when listening) ──────────────────────────────────
function VoiceOverlay({ state, onStop, transcript }) {
  if (state === "off") return null;
  return (
    <div style={{
      position: "absolute", inset: 0, zIndex: 40,
      background: "oklch(0.1 0.01 280 / 0.7)",
      backdropFilter: "blur(14px)",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      gap: 24,
    }}>
      <div style={{ position: "relative", width: 220, height: 220, display: "flex", alignItems: "center", justifyContent: "center" }}>
        {[1,2,3].map(i => (
          <div key={i} style={{
            position: "absolute",
            width: 220 - i*24, height: 220 - i*24,
            borderRadius: "50%",
            border: "1px solid var(--accent)",
            opacity: 0.35 - i*0.08,
            animation: `glow-pulse 2.5s ease-in-out ${i*0.3}s infinite`,
          }} />
        ))}
        <div style={{
          width: 110, height: 110, borderRadius: "50%",
          background: "radial-gradient(circle, var(--accent), oklch(0.4 0.2 295))",
          boxShadow: "0 0 80px var(--accent-glow)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <Icon name={state === "speaking" ? "wave" : "mic"} size={36} />
        </div>
      </div>
      <Waveform active={true} bars={36} />
      <div style={{
        fontFamily: "var(--font-mono)", fontSize: 12, letterSpacing: "0.1em",
        color: "var(--text-muted)", textTransform: "uppercase",
      }}>
        {state === "listening" ? "● listening · whisper-v3" : "● venom speaking · piper-en-7"}
      </div>
      <div style={{
        maxWidth: 520, textAlign: "center", fontSize: 18, color: "var(--text)",
        minHeight: 28, lineHeight: 1.4,
      }}>
        {transcript || <span style={{ color: "var(--text-muted)" }}>say something…</span>}
      </div>
      <button onClick={onStop} className="btn">
        <Icon name="stop" size={13} /> Stop
      </button>
    </div>
  );
}

// ─── Memory drawer (right rail) ──────────────────────────────────────
function MemoryRail({ open, personality, model, provider }) {
  const memories = [
    { tag: "preference", text: "Maya prefers concise replies. No preamble." },
    { tag: "stack", text: "Working in Next.js 15 + Postgres + Drizzle." },
    { tag: "context", text: "Refactoring auth middleware this week." },
    { tag: "language", text: "Studying Italian for Rome trip (28 May)." },
    { tag: "tone", text: "Likes mild sarcasm. Will roll eyes at corporate-speak." },
  ];
  return (
    <aside style={{
      width: open ? 320 : 0,
      flexShrink: 0,
      overflow: "hidden",
      borderLeft: open ? "1px solid var(--border)" : "none",
      background: "oklch(0.115 0.012 280 / 0.85)",
      transition: "width 0.25s ease",
    }}>
      <div style={{ width: 320, padding: 18, display: "flex", flexDirection: "column", gap: 18, height: "100%" }}>
        <div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.1em", color: "var(--text-muted)", textTransform: "uppercase", marginBottom: 10 }}>System status</div>
          <div style={{ display: "grid", gap: 6, fontFamily: "var(--font-mono)", fontSize: 11 }}>
            {[
              ["personality", PERSONALITIES[personality].tag, PERSONALITIES[personality].color],
              ["provider", provider, "var(--accent-bright)"],
              ["model", model, "var(--text)"],
              ["uptime", "4h 12m", "var(--text-dim)"],
              ["tokens (24h)", "184,212", "var(--text-dim)"],
            ].map(([k, v, c]) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "6px 8px", borderRadius: 6, background: "oklch(0.16 0.014 280 / 0.5)" }}>
                <span style={{ color: "var(--text-muted)" }}>{k}</span>
                <span style={{ color: c }}>{v}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.1em", color: "var(--text-muted)", textTransform: "uppercase" }}>Long-term memory</div>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--accent-bright)" }}>{memories.length} entries</span>
          </div>
          <div style={{ flex: 1, overflow: "auto", display: "flex", flexDirection: "column", gap: 8 }}>
            {memories.map((m, i) => (
              <div key={i} style={{
                padding: "10px 12px",
                borderRadius: 8,
                border: "1px solid var(--border)",
                background: "oklch(0.16 0.014 280 / 0.5)",
              }}>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: "0.08em", color: "var(--accent)", textTransform: "uppercase" }}>{m.tag}</div>
                <div style={{ fontSize: 12, color: "var(--text-dim)", marginTop: 4, lineHeight: 1.5 }}>{m.text}</div>
              </div>
            ))}
          </div>
          <button className="btn btn-ghost" style={{ marginTop: 10, justifyContent: "center", fontSize: 11 }}>
            <Icon name="trash" size={12} /> Clear memory
          </button>
        </div>
      </div>
    </aside>
  );
}










// Venom — root app: landing/chat switcher + orchestration + tweaks
const { useState: useS, useEffect: useE, useRef: useR, useMemo: useM, useCallback: useC } = React;

function App() {
  const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
    "accent": "violet",
    "fontPair": "modern",
    "showRail": true,
    "density": "comfortable",
    "personality": "sarcastic",
    "startOnChat": false
  }/*EDITMODE-END*/;

  const [tweaks, setTweak] = useTweaks(TWEAK_DEFAULTS);

  const ACCENT_OPTIONS = {
    violet:  { name: "Violet",  hue: 295, chroma: 0.22 },
    cyan:    { name: "Cyan",    hue: 215, chroma: 0.18 },
    emerald: { name: "Emerald", hue: 155, chroma: 0.18 },
    amber:   { name: "Amber",   hue: 70,  chroma: 0.18 },
  };
  useE(() => {
    const a = ACCENT_OPTIONS[tweaks.accent] || ACCENT_OPTIONS.violet;
    const root = document.documentElement;
    root.style.setProperty("--accent", `oklch(0.68 ${a.chroma} ${a.hue})`);
    root.style.setProperty("--accent-bright", `oklch(0.78 ${a.chroma - 0.02} ${a.hue})`);
    root.style.setProperty("--accent-dim", `oklch(0.55 ${a.chroma - 0.04} ${a.hue})`);
    root.style.setProperty("--accent-glow", `oklch(0.68 ${a.chroma} ${a.hue} / 0.35)`);
  }, [tweaks.accent]);

  useE(() => {
    const pair = tweaks.fontPair;
    const root = document.documentElement;
    if (pair === "mono") {
      root.style.setProperty("--font-sans", "'JetBrains Mono', monospace");
    } else if (pair === "serif") {
      root.style.setProperty("--font-sans", "'Instrument Serif', Georgia, serif");
    } else {
      root.style.setProperty("--font-sans", "'Space Grotesk', system-ui, sans-serif");
    }
  }, [tweaks.fontPair]);

  // App state
  const [view, setView] = useS(tweaks.startOnChat ? "app" : "landing");
  const [chats, setChats] = useS(SEED_CHATS);
  const [activeId, setActiveId] = useS("c1");
  const [provider, setProvider] = useS("hybrid");
  const [model, setModel] = useS("adaptive");
  const [modelOpen, setModelOpen] = useS(false);
  const [busy, setBusy] = useS(false);
  const [voiceState, setVoiceState] = useS("off"); // off | listening | speaking
  const [transcript, setTranscript] = useS("");
  const [privacy, setPrivacy] = useS(false);

  // Personality is mirrored into tweaks for persistence
  const personality = tweaks.personality;
  const setPersonality = (k) => setTweak("personality", k);

  // When privacy toggles, pin provider local
  useE(() => {
    if (privacy && provider !== "local") {
      setProvider("local");
      setModel(PROVIDERS.local.models[0]);
    }
  }, [privacy]);

  // When provider changes, ensure model is valid
  useE(() => {
    const valid = PROVIDERS[provider].models;
    if (!valid.includes(model)) setModel(valid[0]);
  }, [provider]);

  const activeChat = chats.find(c => c.id === activeId);
  const messages = activeChat?.messages || [];

  // Streaming response simulator
  const streamingRef = useR(null);
  const send = useC((text) => {
    if (!activeChat) return;
    const userMsg = { role: "user", text };
    setChats(cs => cs.map(c => c.id === activeId ? {
      ...c, messages: [...(c.messages || []), userMsg, { role: "assistant", text: "", streaming: true, model, provider }],
      preview: text.slice(0, 60), time: "now"
    } : c));
    setBusy(true);

    const full = composeReply(text, personality);
    let i = 0;
    clearInterval(streamingRef.current);
    streamingRef.current = setInterval(() => {
      i += 2 + Math.floor(Math.random() * 4);
      const partial = full.slice(0, i);
      setChats(cs => cs.map(c => {
        if (c.id !== activeId) return c;
        const msgs = c.messages.slice();
        const last = msgs[msgs.length - 1];
        msgs[msgs.length - 1] = { ...last, text: partial };
        return { ...c, messages: msgs };
      }));
      if (i >= full.length) {
        clearInterval(streamingRef.current);
        setChats(cs => cs.map(c => {
          if (c.id !== activeId) return c;
          const msgs = c.messages.slice();
          msgs[msgs.length - 1] = { ...msgs[msgs.length - 1], streaming: false };
          return { ...c, messages: msgs };
        }));
        setBusy(false);
      }
    }, 38);
  }, [activeChat, activeId, model, provider, personality]);

  const newChat = useC(() => {
    const id = "c" + Date.now();
    const c = { id, title: "New conversation", preview: PERSONALITIES[personality].opener.slice(0, 60), time: "now",
      messages: [{ role: "assistant", text: PERSONALITIES[personality].opener, model, provider }] };
    setChats(cs => [c, ...cs]);
    setActiveId(id);
  }, [personality, model, provider]);

  const toggleVoice = useC(() => {
    if (voiceState !== "off") {
      setVoiceState("off"); setTranscript("");
      return;
    }
    setVoiceState("listening");
    // simulate transcript typing
    const phrases = [
      "Hey Venom, what's on my calendar tomorrow?",
      "Hey Venom, draft an email declining the meeting.",
      "Hey Venom, can you summarise the auth refactor?",
    ];
    const phrase = phrases[Math.floor(Math.random() * phrases.length)];
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setTranscript(phrase.slice(0, i));
      if (i >= phrase.length) {
        clearInterval(id);
        setTimeout(() => {
          setVoiceState("speaking");
          setTimeout(() => {
            setVoiceState("off"); setTranscript("");
            send(phrase);
          }, 1800);
        }, 600);
      }
    }, 55);
  }, [voiceState, send]);

  const deleteChat = (id) => setChats(cs => cs.filter(c => c.id !== id));

  const suggestions = useM(() => {
    if (!activeChat || (activeChat.messages || []).length > 2) return [];
    return [
      "What's on my calendar tomorrow?",
      "Refactor this React component",
      "Translate to Italian",
      "Summarise this PDF",
    ];
  }, [activeChat]);

  return (
    <div className="app">
      {view === "landing" ? (
        <Landing onLaunch={() => setView("app")} />
      ) : (
        <ChatView
          chats={chats} activeId={activeId} setActiveId={setActiveId}
          newChat={newChat} deleteChat={deleteChat}
          personality={personality} setPersonality={setPersonality}
          provider={provider} setProvider={setProvider}
          model={model} setModel={setModel}
          modelOpen={modelOpen} setModelOpen={setModelOpen}
          voiceState={voiceState} toggleVoice={toggleVoice} transcript={transcript}
          privacy={privacy} setPrivacy={setPrivacy}
          messages={messages} busy={busy} send={send}
          suggestions={suggestions}
          showRail={tweaks.showRail}
          density={tweaks.density}
          onHome={() => setView("landing")}
        />
      )}

      {/* Tweaks panel */}
      <TweaksPanel>
        <TweakSection label="Brand">
          <AccentSwatchRow
            label="Accent"
            value={tweaks.accent}
            options={Object.keys(ACCENT_OPTIONS)}
            optionMeta={ACCENT_OPTIONS}
            onChange={v => setTweak("accent", v)}
          />
          <TweakRadio label="Type" value={tweaks.fontPair} onChange={v => setTweak("fontPair", v)} options={[
            { value: "modern", label: "Modern" },
            { value: "mono", label: "Mono" },
            { value: "serif", label: "Serif" },
          ]} />
        </TweakSection>
        <TweakSection label="Layout">
          <TweakToggle label="System rail" value={tweaks.showRail} onChange={v => setTweak("showRail", v)} />
          <TweakRadio label="Density" value={tweaks.density} onChange={v => setTweak("density", v)} options={[
            { value: "comfortable", label: "Comfy" },
            { value: "compact", label: "Compact" },
          ]} />
        </TweakSection>
        <TweakSection label="Personality">
          <TweakSelect label="Default core" value={tweaks.personality} onChange={v => setTweak("personality", v)} options={[
            { value: "sarcastic", label: "Sarcastic" },
            { value: "friendly", label: "Friendly" },
            { value: "professional", label: "Professional" },
            { value: "chaos", label: "Chaos" },
          ]} />
        </TweakSection>
        <TweakSection label="Demo">
          <TweakButton label={"Go to " + (view === "landing" ? "Chat" : "Landing")} onClick={() => setView(view === "landing" ? "app" : "landing")} />
          <TweakButton label={voiceState === "off" ? "Trigger voice demo" : "Stop voice"} onClick={toggleVoice} secondary />
        </TweakSection>
      </TweaksPanel>
    </div>
  );
}

// Custom accent swatch row — avoid freeform color picker
function AccentSwatchRow({ label, value, options, optionMeta, onChange }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6, padding: "6px 0" }}>
      <span style={{ fontSize: 11, color: "var(--text-muted, #888)", textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</span>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 6 }}>
        {options.map(opt => {
          const meta = optionMeta[opt];
          const swatch = `oklch(0.68 ${meta.chroma} ${meta.hue})`;
          const active = value === opt;
          return (
            <button key={opt} onClick={() => onChange(opt)} style={{
              padding: "6px 4px",
              borderRadius: 8,
              border: active ? `1px solid ${swatch}` : "1px solid var(--border, rgba(255,255,255,0.1))",
              background: active ? `color-mix(in oklch, ${swatch} 14%, transparent)` : "transparent",
              display: "flex", flexDirection: "column", alignItems: "center", gap: 5,
              cursor: "pointer",
            }}>
              <span style={{ width: 22, height: 12, borderRadius: 3, background: swatch }} />
              <span style={{ fontSize: 10, opacity: active ? 1 : 0.6, textTransform: "capitalize" }}>{opt}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Main chat view ──────────────────────────────────────────────────
function ChatView(props) {
  const { chats, activeId, setActiveId, newChat, deleteChat,
    personality, setPersonality, provider, setProvider, model, setModel,
    modelOpen, setModelOpen, voiceState, toggleVoice, transcript,
    privacy, setPrivacy, messages, busy, send, suggestions,
    showRail, density, onHome } = props;
  const scroller = useR(null);
  useE(() => {
    if (!scroller.current) return;
    scroller.current.scrollTop = scroller.current.scrollHeight;
  }, [messages.length, messages[messages.length - 1]?.text]);

  const pad = density === "compact" ? "14px 22px" : "22px 32px";

  return (
    <div style={{ position: "relative", display: "flex", height: "100%", width: "100%" }}>
      <div className="grid-bg" />
      <Sidebar
        chats={chats} activeId={activeId} onSelect={setActiveId}
        onNew={newChat} onDelete={deleteChat}
        personality={personality} setPersonality={setPersonality}
        onHome={onHome}
      />
      <main style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, position: "relative" }}>
        <TopBar
          provider={provider} setProvider={setProvider}
          model={model} setModel={setModel}
          modelOpen={modelOpen} setModelOpen={setModelOpen}
          voiceState={voiceState} onToggleVoice={toggleVoice}
          privacy={privacy} setPrivacy={setPrivacy}
        />

        {/* Chat thread */}
        <div ref={scroller} style={{ flex: 1, overflow: "auto", padding: pad }}>
          <div style={{ maxWidth: 800, margin: "0 auto" }}>
            <ChatHeader chat={chats.find(c => c.id === activeId)} personality={personality} provider={provider} model={model} />
            {messages.map((m, i) => (
              <Message
                key={i}
                msg={m}
                personality={personality}
                isLast={i === messages.length - 1}
                streaming={m.streaming}
              />
            ))}
            {busy && messages[messages.length - 1]?.text === "" && (
              <div style={{ paddingLeft: 40, marginTop: -4 }}><ThinkingDots /></div>
            )}
            <div style={{ height: 12 }} />
          </div>
        </div>

        <div style={{ maxWidth: 820, margin: "0 auto", width: "100%" }}>
          <Composer
            onSend={send}
            onVoice={toggleVoice}
            voiceState={voiceState}
            busy={busy}
            suggestions={suggestions}
            onSuggest={(s) => send(s)}
          />
        </div>

        <VoiceOverlay state={voiceState} onStop={toggleVoice} transcript={transcript} />
      </main>
      {showRail && <MemoryRail open={showRail} personality={personality} model={model} provider={provider} />}
    </div>
  );
}

function ChatHeader({ chat, personality, provider, model }) {
  if (!chat) return null;
  const p = PERSONALITIES[personality];
  return (
    <div style={{
      paddingBottom: 18, marginBottom: 6,
      borderBottom: "1px solid var(--border)",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
        <Pill tone="purple"><span style={{ color: p.color }}>●</span>{p.tag}</Pill>
        <Pill>{provider} · {model}</Pill>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-muted)", marginLeft: "auto" }}>
          context · 4k / 200k tokens
        </span>
      </div>
      <h2 style={{
        margin: 0, fontSize: 22, fontWeight: 500, letterSpacing: "-0.01em",
      }}>{chat.title}</h2>
    </div>
  );
}

// Personality-flavoured fake reply composer
function composeReply(prompt, personality) {
  const p = prompt.toLowerCase();
  const intros = {
    sarcastic: "Sure, why not. Here's the take:",
    friendly: "Great question! Let me break it down:",
    professional: "Understood. Here is a structured response:",
    chaos: "OKAY OKAY OKAY listen up:",
  };
  const closers = {
    sarcastic: "\n\nYou're welcome. Try not to break it this time.",
    friendly: "\n\nHappy to dig deeper — just say the word.",
    professional: "\n\nPlease let me know if you require further detail.",
    chaos: "\n\nthat's it that's the answer go go go",
  };
  let body;
  if (p.includes("calendar")) {
    body = "Tomorrow you have:\n  • 09:30 — design review (45m)\n  • 11:00 — 1:1 with sam\n  • 14:00 — venom build session ⚡\n  • 17:00 — dentist (you keep moving this — go)";
  } else if (p.includes("email")) {
    body = "Here's a polite decline:\n\n> Hi —\n> Thanks for the invite. Conflict on my end this week. Could you share notes after, or grab time next Tuesday?\n> — m";
  } else if (p.includes("italian") || p.includes("translate")) {
    body = "Five extra-useful ones:\n\n• *Posso pagare con la carta?* — can I pay by card?\n• *È compreso il servizio?* — is service included?\n• *Mi sono perso/persa.* — I'm lost (m/f).\n• *Non parlo bene italiano.* — I don't speak Italian well.\n• *Buona giornata.* — have a good day.";
  } else if (p.includes("refactor") || p.includes("auth")) {
    body = "Here's the move:\n\n  1. Extract `verifyJwt` into `lib/auth/verifyJwt.ts`\n  2. Add `requireUser(req)` that throws `UnauthorizedError`\n  3. Replace the 3 inline calls with `await requireUser(req)`\n  4. Add a single catch in your error middleware → 401\n\nKeeps the call sites one line. Tests get easier — mock `requireUser` once.";
  } else if (p.includes("summar")) {
    body = "Short version:\n\n  • Auth middleware was duplicated across 3 routes.\n  • We're pulling it into a single `requireUser` helper.\n  • The helper throws on failure; error middleware converts to 401.\n  • Net effect: -42 LOC, +1 abstraction, +clear tests.";
  } else {
    body = "Quick answer: depends on the constraints, but the cheapest path is usually:\n  1. Reduce scope.\n  2. Validate the riskiest assumption first.\n  3. Ship the thinnest end-to-end slice you can stand to use yourself.\n\nWhat's the actual constraint here — time, money, or unknowns?";
  }
  return intros[personality] + "\n\n" + body + closers[personality];
}

export default App;


