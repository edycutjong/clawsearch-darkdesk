"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const NAV_ITEMS = [
  { href: "/", label: "Home", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
  { href: "/dashboard", label: "Dashboard", icon: "M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" },
];

export default function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "header-scrolled"
          : "header-top"
      }`}
    >
      {/* Bottom glow line */}
      <div className="header-glow-line" />

      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="logo-container">
            <div className="logo-glow" />
            <div className="logo-icon">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="h-5 w-5 text-sol-dark relative z-10"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-tight leading-none">
              Sol<span className="gradient-text">Sweep</span>
            </span>
            <span className="text-[10px] font-medium text-sol-muted/60 tracking-widest uppercase leading-none mt-0.5">
              Migration Engine
            </span>
          </div>
        </Link>

        {/* Center nav pill */}
        <nav className="nav-pill-container">
          <div className="nav-pill-track">
            {NAV_ITEMS.map(({ href, label, icon }) => {
              const isActive =
                href === "/"
                  ? pathname === "/"
                  : pathname?.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={`nav-pill-item ${isActive ? "nav-pill-active" : ""}`}
                >
                  <svg
                    className={`h-4 w-4 transition-colors duration-300 ${
                      isActive ? "text-sol-green" : "text-sol-muted/60"
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.8}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
                  </svg>
                  <span>{label}</span>
                  {isActive && <span className="nav-active-dot" />}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Right side actions */}
        <div className="flex items-center gap-3">
          {/* Status indicator */}
          <div className="hidden sm:flex items-center gap-2 rounded-full bg-sol-green/5 border border-sol-green/10 px-3 py-1.5">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sol-green opacity-75" />
              <span className="relative inline-block h-1.5 w-1.5 rounded-full bg-sol-green" />
            </span>
            <span className="text-[11px] font-semibold text-sol-green/80 tracking-wide">
              Online
            </span>
          </div>

          {/* GitHub CTA */}
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="github-cta"
          >
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
            <span className="hidden sm:inline">GitHub</span>
            <svg className="h-3 w-3 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      </div>
    </header>
  );
}
