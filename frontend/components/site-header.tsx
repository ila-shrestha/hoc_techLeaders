import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/#explore", label: "Explore Heritage" },
  { href: "/#about", label: "About Ward 16" },
];

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="shell header-inner">
        <Link className="brand" href="/" aria-label="Ward 16 Heritage home">
          <span className="brand-seal" aria-hidden="true">16</span>
          <span className="brand-copy">
            <span className="brand-name">Ward 16</span>
            <span className="brand-subtitle">Heritage archive</span>
          </span>
        </Link>

        <nav className="desktop-nav" aria-label="Primary navigation">
          {navItems.map((item) => <Link key={item.href} href={item.href}>{item.label}</Link>)}
          <span className="nav-divider" aria-hidden="true" />
          <Link className="nav-chat" href="#chatbot">
            Ask the archive <ArrowUpRight size={15} strokeWidth={1.7} />
          </Link>
        </nav>

        <details className="mobile-menu">
          <summary aria-label="Open navigation">Menu <span className="menu-mark" aria-hidden="true">+</span></summary>
          <nav aria-label="Mobile navigation">
            {navItems.map((item) => <Link key={item.href} href={item.href}>{item.label}</Link>)}
            <Link href="#chatbot">Ask the archive</Link>
          </nav>
        </details>
      </div>
    </header>
  );
}
