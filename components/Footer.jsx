import { Icon } from "./primitives";

export function Footer({ t }) {
  return (
    <footer className="footer">
      <div className="footer-brand">
        <img src="/logo-2v.png" alt="2V" />
        <p>{t.footer.about}</p>
        <div style={{ display: "flex", gap: 12, marginTop: 4 }}>
          <a href="#" data-cursor-hover style={{ width: 38, height: 38, border: "1px solid var(--line)", borderRadius: "50%", display: "grid", placeItems: "center" }}><Icon name="wa" /></a>
          <a href="#" data-cursor-hover style={{ width: 38, height: 38, border: "1px solid var(--line)", borderRadius: "50%", display: "grid", placeItems: "center" }}><Icon name="ig" /></a>
        </div>
      </div>
      <div className="footer-col">
        <h5>{t.footer.cols.services}</h5>
        <ul>{t.footer.links.services.map((l, i) => <li key={i}><a href="#" data-cursor-hover>{l}</a></li>)}</ul>
      </div>
      <div className="footer-col">
        <h5>{t.footer.cols.company}</h5>
        <ul>{t.footer.links.company.map((l, i) => <li key={i}><a href="#" data-cursor-hover>{l}</a></li>)}</ul>
      </div>
      <div className="footer-col">
        <h5>{t.footer.cols.connect}</h5>
        <ul>{t.footer.links.connect.map((l, i) => <li key={i}><a href="#" data-cursor-hover>{l}</a></li>)}</ul>
      </div>
      <div className="footer-mega">
        <img src="/logosinfondo.png" alt="2V Digital" />
      </div>
      <div className="footer-bottom">
        <span>{t.footer.copy}</span>
        <span>{t.footer.lang}</span>
      </div>
    </footer>
  );
}
