
"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useLanguage } from "@/i18n/language";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { SearchBar } from "./SearchBar";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { t } = useLanguage();

  const navLinks = [
    { href: "/", label: t.nav.home },
    { href: "/heritage", label: "Heritage Sites" },
    { href: "/about", label: "About" },
  ];

  return (
    <header className="fixed inset-x-0 top-3 z-50 px-3 sm:top-4 sm:px-6">
      <nav className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 rounded-2xl border border-[#E8DED2] bg-[#F6F1EA]/90 px-4 shadow-[0_10px_40px_rgba(61,0,0,0.15)] backdrop-blur-md sm:px-5">

        {/* Logo */}
        <Link href="/" className="flex shrink-0 items-center gap-2.5">
          <Image
            src="/images/ward16-logo.png"
            alt="Ward 16 Logo"
            width={42}
            height={42}
            className="h-10 w-10 object-contain"
            priority
          />
          <span className="hidden font-display text-lg font-semibold tracking-tight text-[#830000] sm:block">
            Ward 16
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 ${
                  active
                    ? "bg-[#BC0202] text-white shadow"
                    : "text-[#3D0000] hover:text-[#BC0202]"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          <SearchBar />

          <Link
            href="/map"
            className="group hidden items-center gap-2 rounded-full bg-[#830000] px-4 py-2 text-sm font-semibold text-white shadow-md transition-all duration-300 hover:bg-[#BC0202] hover:shadow-[0_0_20px_rgba(131,0,0,0.35)] active:scale-95 sm:inline-flex"
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-transform group-hover:scale-110"
            >
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            {t.mapBtn}
          </Link>

          <LanguageSwitcher />

          {/* Mobile Menu Button */}
          <button
            className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 rounded-xl bg-[#830000]/10 lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label={t.nav.toggleMenu}
            aria-expanded={open}
          >
            <span
              className={`h-0.5 w-6 bg-[#3D0000] transition-transform ${
                open ? "translate-y-2 rotate-45" : ""
              }`}
            />
            <span
              className={`h-0.5 w-6 bg-[#3D0000] transition-opacity ${
                open ? "opacity-0" : ""
              }`}
            />
            <span
              className={`h-0.5 w-6 bg-[#3D0000] transition-transform ${
                open ? "-translate-y-2 -rotate-45" : ""
              }`}
            />
          </button>
        </div>
      </nav>

      {/* Mobile Navigation */}
      {open && (
        <div className="mx-auto mt-2 max-w-6xl rounded-2xl border border-[#E8DED2] bg-[#F6F1EA]/95 p-4 shadow-xl backdrop-blur-md lg:hidden">
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-xl px-4 py-3 text-base font-medium text-[#3D0000] hover:bg-[#830000]/10 hover:text-[#BC0202]"
              >
                {link.label}
              </Link>
            ))}

            <Link
              href="/map"
              onClick={() => setOpen(false)}
              className="mt-2 flex items-center justify-center gap-2 rounded-full bg-[#830000] px-4 py-3 text-sm font-semibold text-white"
            >
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              {t.mapBtn}
            </Link>

            <div className="mt-2">
              <SearchBar onNavigate={() => setOpen(false)} />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
