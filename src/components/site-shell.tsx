"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Menu, X, ArrowRight } from "lucide-react";
import { site } from "@/lib/content";

export function Brand({ light = false }: { light?: boolean }) {
  return (
    <Link
      className={`brand ${light ? "brand-light" : ""}`}
      href="/"
      aria-label="Green Arc Commune home"
    >
      <span className="brand-logo-crop">
        <Image
          src="/images/green-arc-logo.png"
          alt="Green Arc Commune"
          width={315}
          height={315}
          loading="eager"
        />
      </span>
    </Link>
  );
}
const nav = [
  ["Our approach", "/#approach"],
  ["Programmes", "/#programmes"],
  ["The commune", "/#commune"],
  ["Stories", "/#stories"],
];
export function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  useEffect(() => {
    if (!open) return;
    function close(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [open]);
  if (pathname.startsWith("/admin")) return null;
  return (
    <header className="site-header">
      <div className="nav-inner">
        <Brand />
        <nav className="desktop-nav" aria-label="Main navigation">
          {nav.map(([label, href]) => (
            <Link key={label} href={href}>
              {label}
            </Link>
          ))}
        </nav>
        <Link href="/#contact" className="nav-cta">
          Let’s talk <ArrowUpRight size={16} />
        </Link>
        <button
          className="menu-toggle"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-navigation"
          onClick={() => setOpen(!open)}
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && (
        <nav
          id="mobile-navigation"
          className="mobile-nav"
          aria-label="Mobile navigation"
          key={pathname}
        >
          {nav.map(([label, href]) => (
            <Link key={label} href={href} onClick={() => setOpen(false)}>
              {label}
              <ArrowUpRight />
            </Link>
          ))}
          <Link href="/#contact" onClick={() => setOpen(false)}>
            Let’s talk
            <ArrowUpRight />
          </Link>
        </nav>
      )}
    </header>
  );
}
export function Footer() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;
  return (
    <footer className="footer">
      <div className="footer-top">
        <Brand light />
        <p>
          A considered approach to markets.
          <br />A community to grow with.
        </p>
        <div className="social-links">
          <a
            href={site.instagram}
            target="_blank"
            rel="noreferrer"
            aria-label="Green Arc on Instagram"
          >
            Instagram <ArrowUpRight size={16} />
          </a>
          <a href={site.telegram} target="_blank" rel="noreferrer">
            Telegram <ArrowUpRight size={16} />
          </a>
        </div>
      </div>
      <div className="footer-wordmark" aria-hidden="true">
        grow together
        <ArrowUpRight aria-hidden="true" className="footer-arrow" />
      </div>
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} Green Arc Commune</p>
        <div>
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms & disclosures</Link>
          <a href="#main">
            Back to top <ArrowRight className="up-arrow" size={14} />
          </a>
        </div>
      </div>
      <p className="risk-note">
        Trading involves risk. Our content is educational; individual
        experiences do not guarantee future results. Community stock photography
        are temporary preview assets.
      </p>
    </footer>
  );
}
