"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaHeart, FaPhoneAlt, FaFeather } from "react-icons/fa";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "./ui/button";

export function NavBar() {
  const pathname = usePathname();

  const navLinks = [
    { href: "/", label: "Início" },
    { href: "/unburdens", label: "Desabafos" },
    { href: "/about", label: "Sobre" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-background/90 border-b border-border/80 transition-colors duration-200 shadow-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 sm:py-4 min-h-[4.25rem] sm:min-h-[4.75rem] flex items-center justify-between gap-3">
        <Link
          href="/"
          className="group flex items-center gap-2.5 transition-transform active:scale-95 shrink-0"
        >
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-tr from-rose-500 to-rose-400 flex items-center justify-center text-white shadow-soft group-hover:shadow-soft-md transition-shadow">
            <FaHeart className="w-4 h-4 text-white animate-pulse" />
          </div>
          <span className="text-base sm:text-lg md:text-xl font-bold tracking-tight text-foreground group-hover:text-rose-500 transition-colors">
            Desabafo Anônimo
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1.5">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`
                  px-4 py-2 rounded-2xl text-sm font-medium transition-all duration-200
                  ${
                    isActive
                      ? "text-rose-500 bg-rose-500/10 font-semibold"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/70"
                  }
                `}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <a
            href="https://cvv.org.br"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-300/40 dark:border-rose-800/40 px-3.5 py-2 rounded-full transition-all duration-200 active:scale-95"
            title="Centro de Valorização da Vida - Apoio emocional 24h gratuito pelo telefone 188"
          >
            <FaPhoneAlt className="text-[11px] animate-bounce" />
            <span>
              Apoio 24h: <strong>188</strong>
            </span>
          </a>

          <a
            href="https://cvv.org.br"
            target="_blank"
            rel="noopener noreferrer"
            className="sm:hidden inline-flex items-center justify-center w-9 h-9 rounded-full text-rose-600 dark:text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-300/40 dark:border-rose-800/40 transition-all duration-200 active:scale-95"
            title="Ligue 188 - Apoio Emocional CVV"
            aria-label="Ligue 188 - Apoio Emocional CVV"
          >
            <FaPhoneAlt className="text-xs" />
          </a>

          <Link href="/unburden" className="hidden sm:block">
            <Button
              variant="warm"
              size="sm"
              className="gap-1.5 font-semibold text-xs shadow-soft px-4 py-2"
            >
              <FaFeather className="w-3.5 h-3.5" />
              <span>Desabafar</span>
            </Button>
          </Link>

          <ThemeToggle />
        </div>
      </div>

      <div className="md:hidden flex items-center justify-around border-t border-border/60 py-2.5 px-3 bg-background/95 backdrop-blur-md">
        {navLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`
                text-xs font-medium px-3 py-1.5 rounded-xl transition-colors
                ${
                  isActive
                    ? "text-rose-500 bg-rose-500/10 font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }
              `}
            >
              {link.label}
            </Link>
          );
        })}
        <Link
          href="/unburden"
          className="text-xs font-semibold text-rose-600 dark:text-rose-400 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/10 border border-rose-400/20"
        >
          <FaFeather className="w-3 h-3" />
          <span>Desabafar</span>
        </Link>
      </div>
    </header>
  );
}
