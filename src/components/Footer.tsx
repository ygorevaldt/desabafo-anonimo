import Link from "next/link";
import { FaHeart, FaPhoneAlt } from "react-icons/fa";

export function Footer() {
  return (
    <footer className="w-full border-t border-border/80 bg-card/60 backdrop-blur-sm transition-colors py-8 px-4 sm:px-6 lg:px-8 mt-auto">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-center sm:text-left">
          <p>© {new Date().getFullYear()} Desabafo Anônimo.</p>
          <span className="hidden sm:inline text-border">•</span>
          <p>Um espaço seguro, gentil e confidencial para o seu coração.</p>
        </div>

        <div className="flex items-center gap-4">
          <a
            href="https://cvv.org.br"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-rose-500 hover:text-rose-600 font-medium transition-colors"
          >
            <FaPhoneAlt className="text-[10px]" />
            <span>CVV 188</span>
          </a>
          <span className="text-border">•</span>
          <div className="flex items-center gap-1.5">
            <span>Desenvolvido com</span>
            <FaHeart className="text-rose-500 w-3 h-3 animate-pulse" />
            <span>por</span>
            <Link
              href="https://github.com/ygorevaldt"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-foreground hover:text-rose-500 transition-colors"
            >
              Ygor Evaldt
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
