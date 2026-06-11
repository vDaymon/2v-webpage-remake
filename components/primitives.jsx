// shared primitive components (icons, mockups)

export function Icon({ name, ...p }) {
  const common = { width: 32, height: 32, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "round", strokeLinejoin: "round", ...p };
  switch (name) {
    case "web":
      return (<svg {...common}><rect x="2" y="4" width="20" height="16" rx="2" /><path d="M2 9h20M6 13h6M6 16h4" /></svg>);
    case "search":
      return (<svg {...common}><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>);
    case "spark":
      return (<svg {...common}><path d="M12 3v6M12 15v6M3 12h6M15 12h6" /><path d="m6 6 3 3M15 15l3 3M6 18l3-3M15 9l3-3" /></svg>);
    case "code":
      return (<svg {...common}><path d="m8 6-6 6 6 6M16 6l6 6-6 6M14 4l-4 16" /></svg>);
    case "send":
      return (<svg {...common} width={16} height={16}><path d="M5 12h14M13 6l6 6-6 6" /></svg>);
    case "arrow":
      return (<svg {...common} width={14} height={14}><path d="M5 12h14M13 6l6 6-6 6" /></svg>);
    case "wa":
      return (<svg viewBox="0 0 24 24" width={18} height={18} fill="currentColor"><path d="M17.5 14.4c-.3-.1-1.7-.8-2-.9s-.5-.1-.7.1-.7.9-.9 1.1-.4.2-.7.1c-1-.5-1.7-.9-2.4-2-.2-.3.2-.3.5-.9.1-.2 0-.3 0-.5s-.7-1.6-.9-2.2c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4s-1 1-1 2.4 1 2.8 1.2 3 2 3 4.8 4.2c1.7.7 2.3.8 3.2.7.5-.1 1.7-.7 2-1.4s.3-1.2.2-1.4c-.1-.1-.3-.2-.6-.4zM12 2C6.5 2 2 6.5 2 12c0 1.8.5 3.5 1.3 5L2 22l5.2-1.3c1.4.8 3.1 1.3 4.8 1.3 5.5 0 10-4.5 10-10S17.5 2 12 2z"/></svg>);
    case "ig":
      return (<svg viewBox="0 0 24 24" width={18} height={18} fill="none" stroke="currentColor" strokeWidth={1.6}><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="0.7" fill="currentColor" /></svg>);
    case "star":
      return (<svg viewBox="0 0 24 24" width={14} height={14} fill="currentColor"><path d="M12 2 L14 10 L22 12 L14 14 L12 22 L10 14 L2 12 L10 10 Z" /></svg>);
    default:
      return null;
  }
}

// abstract mockup graphics — placeholder browser/phone visuals
export function MockBrowser({ accent = "purple", title = "Your Site" }) {
  return (
    <div className="mock-browser">
      <div className="bar"><i></i><i></i><i></i></div>
      <div className="body" style={{ padding: "18px 20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16, alignItems: "center" }}>
          <div style={{ width: 18, height: 18, background: "var(--accent-bright)", borderRadius: 4 }}></div>
          <div style={{ display: "flex", gap: 10, fontSize: 8, color: "oklch(0.4 0.05 var(--hue))" }}>
            <span>Home</span><span>Work</span><span>About</span><span>Contact</span>
          </div>
        </div>
        <div style={{ fontSize: 28, fontWeight: 600, lineHeight: 1, letterSpacing: "-0.04em", marginBottom: 8 }}>
          {title}
        </div>
        <div style={{ fontSize: 9, color: "oklch(0.45 0.05 var(--hue))", lineHeight: 1.4, marginBottom: 14, maxWidth: "70%" }}>
          A bold new way to find what you're looking for. Modern, fast, beautifully designed.
        </div>
        <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
          <div style={{ background: "oklch(0.18 0.06 var(--hue))", color: "white", padding: "5px 10px", borderRadius: 100, fontSize: 8 }}>Get started</div>
          <div style={{ border: "1px solid oklch(0.85 0.02 var(--hue))", padding: "5px 10px", borderRadius: 100, fontSize: 8 }}>Learn more</div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6 }}>
          <div style={{ aspectRatio: "1", background: "linear-gradient(135deg, oklch(0.72 0.18 var(--hue)), oklch(0.42 0.20 var(--hue)))", borderRadius: 6 }}></div>
          <div style={{ aspectRatio: "1", background: "oklch(0.92 0.02 var(--hue))", borderRadius: 6 }}></div>
          <div style={{ aspectRatio: "1", background: "oklch(0.85 0.05 var(--hue))", borderRadius: 6 }}></div>
        </div>
      </div>
    </div>
  );
}

export function MockPhone({ title = "App" }) {
  return (
    <div className="mock-phone">
      <div className="screen">
        <div style={{ padding: "30px 16px 16px", height: "100%", display: "flex", flexDirection: "column", color: "oklch(0.20 0.06 var(--hue))" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
            <div style={{ fontSize: 11, fontWeight: 600 }}>9:41</div>
            <div style={{ width: 22, height: 8, background: "oklch(0.30 0.06 var(--hue))", borderRadius: 4 }}></div>
          </div>
          <div style={{ fontSize: 22, fontWeight: 600, letterSpacing: "-0.03em", lineHeight: 1, marginBottom: 4 }}>{title}</div>
          <div style={{ fontSize: 9, color: "oklch(0.5 0.05 var(--hue))", marginBottom: 14 }}>Today's session</div>
          <div style={{ background: "oklch(0.96 0.02 var(--hue))", borderRadius: 14, padding: 12, marginBottom: 10 }}>
            <div style={{ fontSize: 8, color: "oklch(0.5 0.05 var(--hue))", marginBottom: 4 }}>PROGRESS</div>
            <div style={{ fontSize: 26, fontWeight: 600, letterSpacing: "-0.03em" }}>74%</div>
            <div style={{ height: 4, background: "oklch(0.88 0.02 var(--hue))", borderRadius: 4, marginTop: 6, overflow: "hidden" }}>
              <div style={{ height: "100%", width: "74%", background: "var(--accent-bright)" }}></div>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 10 }}>
            <div style={{ aspectRatio: "1.2", background: "linear-gradient(135deg, oklch(0.72 0.18 var(--hue)), oklch(0.42 0.20 var(--hue)))", borderRadius: 12, display: "flex", alignItems: "end", padding: 8, color: "white", fontSize: 9, fontWeight: 600 }}>HIIT 30'</div>
            <div style={{ aspectRatio: "1.2", background: "oklch(0.96 0.02 var(--hue))", borderRadius: 12, display: "flex", alignItems: "end", padding: 8, fontSize: 9, fontWeight: 600 }}>Yoga 45'</div>
          </div>
          <div style={{ marginTop: "auto", display: "flex", gap: 10, justifyContent: "center", padding: 8 }}>
            {["●","○","○","○"].map((d, i) => <span key={i} style={{ fontSize: 10, color: i === 0 ? "var(--accent-bright)" : "oklch(0.7 0.05 var(--hue))" }}>{d}</span>)}
          </div>
        </div>
      </div>
    </div>
  );
}
