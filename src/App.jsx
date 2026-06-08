import { useState } from "react";

// ─── BRAND CONFIG ─────────────────────────────────────────────────────────────
// When you deploy to Netlify:
//   1. Put your VDB logo PNG in /public/vdb-logo.png
//   2. Put your Canva banner PNG in /public/banner.png
// Those paths are referenced below. The app will use them automatically.
const LOGO_SRC = "/vdb-logo.png";
const BANNER_SRC = "/banner.png"; // Your Canva "VA Disability Calculator" banner

const COLORS = {
  gold:        "#C8A028",
  goldLight:   "#E8C96B",
  goldDim:     "#C8A02888",
  navy:        "#0A1628",
  navyMid:     "#0F1E38",
  navyLight:   "#1A2744",
  navyBorder:  "#1E3A5F",
  red:         "#B22234",
  white:       "#FFFFFF",
  textPrimary: "#E2E8F0",
  textMuted:   "#94A3B8",
  textDim:     "#64748B",
  textDimmer:  "#475569",
};

const CONDITIONS = [
  "PTSD",
  "TBI (Traumatic Brain Injury)",
  "Hearing Loss",
  "Tinnitus",
  "Sleep Apnea (OSA)",
  "Knee — Left",
  "Knee — Right",
  "Hip — Left",
  "Hip — Right",
  "Back / Lumbar",
  "Neck / Cervical",
  "Shoulder — Left",
  "Shoulder — Right",
  "Migraines",
  "Diabetes Mellitus",
  "Hypertension",
  "Anxiety Disorder",
  "Depression / MDD",
  "Radiculopathy — Left",
  "Radiculopathy — Right",
  "Scars / Skin Conditions",
  "Foot / Plantar Fasciitis",
  "Elbow — Left",
  "Elbow — Right",
  "Wrist — Left",
  "Wrist — Right",
  "Erectile Dysfunction",
  "IBS / Digestive Condition",
  "Sinusitis / Rhinitis",
  "Other",
];

const RATING_OPTIONS = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];

// ─── VA MATH ──────────────────────────────────────────────────────────────────
function computeVARating(ratings) {
  const sorted = [...ratings].sort((a, b) => b - a);
  let remaining = 100;
  const steps = [];
  for (const r of sorted) {
    const before = remaining;
    remaining = remaining * (1 - r / 100);
    steps.push({ rating: r, before, combined: 100 - remaining });
  }
  const raw = 100 - remaining;
  const rounded5  = Math.round(raw / 5) * 5;
  const rounded10 = Math.round(rounded5 / 10) * 10;
  return { raw, rounded5, rounded10, steps };
}

function getRatingColor(pct) {
  if (pct >= 70) return "#22C55E";
  if (pct >= 50) return "#F59E0B";
  if (pct >= 30) return "#FB923C";
  return COLORS.textMuted;
}

function getRatingLabel(pct) {
  if (pct >= 100) return "100% — Full Schedular Rating";
  if (pct >= 70)  return "70%+ — Individual Unemployability Eligible";
  if (pct >= 50)  return "50%+ — Enhanced Benefits Tier";
  if (pct >= 30)  return "30%+ — Dependent Allowance Eligible";
  if (pct >= 10)  return "10%+ — Service Connected";
  return "Below Rating Threshold";
}

// ─── COMPONENT ────────────────────────────────────────────────────────────────
export default function VACalculator() {
  const [conditions, setConditions] = useState([{ id: 1, name: "", rating: 10 }]);
  const [nextId, setNextId]         = useState(2);
  const [bannerError, setBannerError] = useState(false);
  const [logoError, setLogoError]     = useState(false);

  const addCondition    = () => { setConditions(c => [...c, { id: nextId, name: "", rating: 10 }]); setNextId(n => n + 1); };
  const removeCondition = id => setConditions(c => c.filter(x => x.id !== id));
  const updateCondition = (id, field, value) => setConditions(c => c.map(x => x.id === id ? { ...x, [field]: value } : x));

  const validRatings = conditions.map(c => c.rating).filter(r => r > 0);
  const result       = validRatings.length ? computeVARating(validRatings) : null;
  const displayPct   = result ? result.rounded10 : 0;
  const ratingColor  = getRatingColor(displayPct);

  return (
    <div style={{ minHeight: "100vh", background: `linear-gradient(160deg, #060D1A 0%, ${COLORS.navy} 50%, #0D1F36 100%)`, fontFamily: "'Georgia', 'Times New Roman', serif", color: COLORS.textPrimary, padding: "0 0 60px 0" }}>

      {/* ── BANNER IMAGE (Canva export goes here) ── */}
      {!bannerError ? (
        <div style={{ width: "100%", maxHeight: 220, overflow: "hidden", borderBottom: `3px solid ${COLORS.gold}` }}>
          <img
            src={BANNER_SRC}
            alt="VA Disability Calculator — VA Benefits Blueprint"
            onError={() => setBannerError(true)}
            style={{ width: "100%", objectFit: "cover", objectPosition: "center top", display: "block" }}
          />
        </div>
      ) : (
        /* Fallback header if no banner image yet */
        <div style={{
          background: `linear-gradient(135deg, #060D1A 0%, ${COLORS.navyLight} 40%, ${COLORS.red}22 100%)`,
          borderBottom: `3px solid ${COLORS.gold}`,
          padding: "28px 24px 22px",
          position: "relative",
          overflow: "hidden",
        }}>
          {/* Stars pattern background */}
          <div style={{ position: "absolute", inset: 0, opacity: 0.04, backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "24px 24px", pointerEvents: "none" }} />

          <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 16, maxWidth: 680, margin: "0 auto" }}>
            {/* VDB Logo */}
            {!logoError ? (
              <img src={LOGO_SRC} alt="VDB Logo" onError={() => setLogoError(true)}
                style={{ width: 64, height: 64, borderRadius: "50%", objectFit: "cover", flexShrink: 0, border: `2px solid ${COLORS.gold}`, boxShadow: `0 0 20px ${COLORS.gold}44` }} />
            ) : (
              <div style={{ width: 64, height: 64, borderRadius: "50%", background: COLORS.navyBorder, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, flexShrink: 0, border: `2px solid ${COLORS.gold}` }}>🎖️</div>
            )}

            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, color: COLORS.textDim, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 4 }}>VA Benefits Blueprint</div>
              <div style={{ fontSize: 26, fontWeight: "bold", color: COLORS.gold, letterSpacing: "0.02em", textShadow: `0 0 30px ${COLORS.gold}55`, lineHeight: 1.1 }}>
                VA Disability Calculator
              </div>
              <div style={{ fontSize: 11, color: COLORS.textDimmer, marginTop: 5, letterSpacing: "0.1em" }}>Written by a 10-Year U.S. Navy Veteran</div>
            </div>

            {/* Red/White stripe accent */}
            <div style={{ display: "flex", flexDirection: "column", gap: 4, flexShrink: 0 }}>
              {[COLORS.red, COLORS.white, COLORS.red, COLORS.white, COLORS.red].map((c, i) => (
                <div key={i} style={{ width: 32, height: 4, background: c, opacity: c === COLORS.white ? 0.15 : 0.5, borderRadius: 2 }} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── MAIN CONTENT ── */}
      <div style={{ maxWidth: 680, margin: "0 auto", padding: "28px 16px 0" }}>

        {/* Result Card */}
        <div style={{
          background: `linear-gradient(135deg, ${COLORS.navyMid} 0%, ${COLORS.navyLight} 100%)`,
          border: `2px solid ${ratingColor}`,
          borderRadius: 18,
          padding: "28px 24px",
          marginBottom: 24,
          textAlign: "center",
          boxShadow: `0 0 50px ${ratingColor}1A`,
          transition: "border-color 0.5s, box-shadow 0.5s",
          position: "relative",
          overflow: "hidden",
        }}>
          <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at 50% 0%, ${ratingColor}0D 0%, transparent 65%)`, pointerEvents: "none" }} />

          <div style={{ fontSize: 11, color: COLORS.textDim, letterSpacing: "0.16em", textTransform: "uppercase", marginBottom: 6 }}>
            Combined VA Rating
          </div>

          <div style={{ fontSize: 88, fontWeight: "bold", color: ratingColor, lineHeight: 1, textShadow: `0 0 50px ${ratingColor}55`, transition: "color 0.5s", fontVariantNumeric: "tabular-nums" }}>
            {displayPct}<span style={{ fontSize: 44 }}>%</span>
          </div>

          {result && (
            <div style={{ marginTop: 12 }}>
              <div style={{ display: "inline-block", background: `${ratingColor}1A`, border: `1px solid ${ratingColor}44`, borderRadius: 20, padding: "5px 18px", fontSize: 12, color: ratingColor, letterSpacing: "0.05em" }}>
                {getRatingLabel(displayPct)}
              </div>
            </div>
          )}

          {result && (
            <div style={{ marginTop: 14, display: "flex", justifyContent: "center", flexWrap: "wrap", gap: "6px 20px", fontSize: 11, color: COLORS.textDim }}>
              <span>Raw: <span style={{ color: COLORS.textMuted }}>{result.raw.toFixed(2)}%</span></span>
              <span style={{ color: COLORS.navyBorder }}>›</span>
              <span>Nearest 5: <span style={{ color: COLORS.textMuted }}>{result.rounded5}%</span></span>
              <span style={{ color: COLORS.navyBorder }}>›</span>
              <span>VA Final: <span style={{ color: ratingColor, fontWeight: "bold" }}>{result.rounded10}%</span></span>
            </div>
          )}

          {!result && (
            <div style={{ marginTop: 10, color: COLORS.textDimmer, fontSize: 13 }}>
              Add your service-connected conditions below to calculate
            </div>
          )}
        </div>

        {/* How VA Math Works */}
        <div style={{ background: `${COLORS.navyMid}99`, border: `1px solid ${COLORS.navyBorder}`, borderLeft: `3px solid ${COLORS.gold}`, borderRadius: 10, padding: "13px 18px", marginBottom: 24, fontSize: 12, color: COLORS.textDim, lineHeight: 1.7 }}>
          <span style={{ color: COLORS.gold, fontWeight: "bold" }}>How VA Math Works: </span>
          The VA uses a "whole person" formula — not simple addition. Each disability reduces your
          <em> remaining</em> able-body percentage. Example: 50% + 30% = <strong style={{ color: COLORS.textMuted }}>65%</strong> combined, not 80%.
          Conditions are applied highest-first. Final rating rounds to the nearest 10%.
        </div>

        {/* Conditions */}
        <div style={{ fontSize: 11, color: COLORS.textDim, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 12 }}>
          Service-Connected Conditions ({conditions.length})
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 10 }}>
          {conditions.map((c, i) => (
            <div key={c.id}
              style={{ background: `linear-gradient(90deg, ${COLORS.navyMid} 0%, #111C30 100%)`, border: `1px solid ${COLORS.navyBorder}`, borderRadius: 12, padding: "12px 14px", display: "flex", gap: 10, alignItems: "center", transition: "border-color 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.borderColor = `${COLORS.gold}55`}
              onMouseLeave={e => e.currentTarget.style.borderColor = COLORS.navyBorder}
            >
              {/* Number badge */}
              <div style={{ width: 26, height: 26, borderRadius: "50%", background: COLORS.navyBorder, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: COLORS.gold, flexShrink: 0, fontWeight: "bold" }}>
                {i + 1}
              </div>

              {/* Condition dropdown */}
              <select value={c.name} onChange={e => updateCondition(c.id, "name", e.target.value)}
                style={{ flex: 1, background: COLORS.navy, border: `1px solid ${COLORS.navyBorder}`, borderRadius: 8, color: c.name ? COLORS.textPrimary : COLORS.textDimmer, padding: "8px 10px", fontSize: 14, outline: "none", cursor: "pointer" }}>
                <option value="">Select condition...</option>
                {CONDITIONS.map(cn => <option key={cn} value={cn}>{cn}</option>)}
              </select>

              {/* Rating dropdown */}
              <select value={c.rating} onChange={e => updateCondition(c.id, "rating", parseInt(e.target.value))}
                style={{ background: COLORS.navy, border: `1px solid ${COLORS.navyBorder}`, borderRadius: 8, color: COLORS.gold, padding: "8px 10px", fontSize: 15, fontWeight: "bold", width: 82, outline: "none", cursor: "pointer", textAlign: "center" }}>
                {RATING_OPTIONS.map(r => <option key={r} value={r}>{r}%</option>)}
              </select>

              {/* Remove */}
              <button onClick={() => removeCondition(c.id)}
                style={{ width: 30, height: 30, background: "transparent", border: `1px solid ${COLORS.navyBorder}`, borderRadius: 8, color: COLORS.textDimmer, cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.2s" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "#EF4444"; e.currentTarget.style.color = "#EF4444"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = COLORS.navyBorder; e.currentTarget.style.color = COLORS.textDimmer; }}>
                ×
              </button>
            </div>
          ))}
        </div>

        {/* Add condition button */}
        <button onClick={addCondition}
          style={{ width: "100%", background: "transparent", border: `2px dashed ${COLORS.navyBorder}`, borderRadius: 12, color: COLORS.textDimmer, padding: "13px", fontSize: 13, cursor: "pointer", letterSpacing: "0.08em", transition: "all 0.2s", marginBottom: 28 }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = `${COLORS.gold}66`; e.currentTarget.style.color = COLORS.gold; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = COLORS.navyBorder; e.currentTarget.style.color = COLORS.textDimmer; }}>
          + Add Condition
        </button>

        {/* Step-by-step breakdown */}
        {result && result.steps.length > 1 && (
          <div style={{ background: `${COLORS.navyMid}99`, border: `1px solid ${COLORS.navyBorder}`, borderRadius: 12, overflow: "hidden", marginBottom: 32 }}>
            <div style={{ padding: "11px 18px", borderBottom: `1px solid ${COLORS.navyBorder}`, fontSize: 10, color: COLORS.textDim, letterSpacing: "0.14em", textTransform: "uppercase", display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ color: COLORS.gold }}>◆</span> Step-by-Step Calculation
            </div>
            {result.steps.map((step, i) => {
              const cond = [...conditions].sort((a, b) => b.rating - a.rating)[i];
              return (
                <div key={i} style={{ display: "flex", alignItems: "center", padding: "10px 16px", borderBottom: i < result.steps.length - 1 ? `1px solid ${COLORS.navyBorder}33` : "none", gap: 10, fontSize: 12 }}>
                  <span style={{ width: 38, height: 20, background: `${COLORS.gold}1A`, border: `1px solid ${COLORS.gold}44`, borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center", color: COLORS.gold, fontSize: 10, fontWeight: "bold", flexShrink: 0 }}>
                    {step.rating}%
                  </span>
                  <span style={{ flex: 1, color: COLORS.textMuted }}>{cond?.name || `Condition ${i + 1}`}</span>
                  <span style={{ color: COLORS.textDim, fontSize: 11 }}>
                    {step.before.toFixed(1)}% × {(1 - step.rating / 100).toFixed(2)} =
                  </span>
                  <span style={{ color: COLORS.textPrimary, fontWeight: "bold", minWidth: 58, textAlign: "right" }}>
                    {step.combined.toFixed(2)}%
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {/* Footer */}
        <div style={{ textAlign: "center", borderTop: `1px solid ${COLORS.navyBorder}`, paddingTop: 20, fontSize: 11, color: COLORS.textDimmer, lineHeight: 2 }}>
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 10, marginBottom: 8 }}>
            {!logoError && <img src={LOGO_SRC} alt="VDB" onError={() => setLogoError(true)} style={{ width: 28, height: 28, borderRadius: "50%", objectFit: "cover", opacity: 0.7 }} />}
            <span style={{ color: `${COLORS.gold}99`, letterSpacing: "0.08em" }}>VA Benefits Blueprint · VA Disability Calculator</span>
          </div>
          <div style={{ color: "#334155" }}>
            Written by a 10-Year U.S. Navy Veteran<br />
            For informational purposes only — always verify with official VA records.<br />
            Formula per 38 CFR Part 4 (VA Combined Ratings Table).
          </div>
        </div>
      </div>
    </div>
  );
}
