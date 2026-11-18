import Link from "next/link";
import { ArrowUpRight, Instagram } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="site-footer" id="chatbot">
      <div className="shell footer-grid">
        <div className="footer-intro">
          <p className="eyebrow light">A living archive</p>
          <h2>Keep the stories close.</h2>
          <p>Ward 16 Heritage is a growing digital field guide for places, practices, and memories documented with community care.</p>
          <a className="footer-social" href="mailto:heritage@ward16.example">Share a story <ArrowUpRight size={15} /></a>
        </div>
        <div className="footer-column">
          <p className="footer-label">Navigate</p>
          <Link href="/">Home</Link>
          <Link href="/#explore">Explore heritage</Link>
          <Link href="/#about">About Ward 16</Link>
          <Link href="#chatbot">Archive questions</Link>
        </div>
        <div className="footer-column">
          <p className="footer-label">Stories</p>
          <Link href="/heritage/siddhi-ganesh">Siddhi Ganesh</Link>
          <Link href="/heritage/koncha-dyo">Koncha Dyo</Link>
          <span>22 Dhara</span>
          <span>Ajima sites &amp; Gurunakak</span>
        </div>
        <div className="footer-column footer-note">
          <p className="footer-label">Archive note</p>
          <p>The chatbot is planned as a database-powered guide for verified stored information. It is not connected in this first release.</p>
          <p className="footer-mark"><Instagram size={14} /> Ward 16 · Nepal</p>
        </div>
      </div>
      <div className="shell footer-bottom">
        <span>© 2026 Ward 16 Heritage</span>
        <span>Built for memory, participation, and care.</span>
      </div>
    </footer>
  );
}
