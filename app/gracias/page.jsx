import Link from "next/link";
import { SITE } from "@/lib/site";
import { Icon } from "@/components/primitives";
import { CustomCursor } from "@/components/hooks";

export const metadata = {
  title: "¡Gracias por contactar! · 2V Digital",
  description: "Gracias por escribirnos. Te respondemos por WhatsApp lo antes posible.",
  robots: { index: false, follow: true },
  alternates: { canonical: "/gracias" },
};

export default function Gracias() {
  return (
    <div className="gracias-page" style={{ "--pink-h": "340" }}>
      <CustomCursor enabled />
      <main className="gracias">
        <img className="gracias-logo" src="/logosinfondo.png" alt="2V Digital" />
        <h1 className="gracias-title">¡Gracias por contactar! 👋</h1>
        <p className="gracias-text">
          Te abrimos WhatsApp para terminar de cotizar tu proyecto. Si no se abrió,
          tocá el botón de abajo. Respondemos en menos de 4 horas.
        </p>
        <div className="gracias-row">
          <a href={SITE.whatsapp} target="_blank" rel="noreferrer" className="btn btn-pink" data-cursor-hover>
            <Icon name="wa" /> <span>Abrir WhatsApp</span>
          </a>
          <Link href="/" className="btn btn-ghost" data-cursor-hover>
            <span>Volver al inicio</span> <Icon name="arrow" className="arrow" />
          </Link>
        </div>
      </main>
    </div>
  );
}
