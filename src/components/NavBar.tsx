import Link from "next/link";
import { FaPhoneAlt } from "react-icons/fa";

export function NavBar() {
  return (
    <aside
      className="
        flex items-center justify-between
        px-4 md:px-10 py-5
        border-b-2 border-zinc-200
        w-full bg-white
      "
    >
      <Link href={"/"}>
        <h1 className="text-[1.5rem] md:text-[1.65rem] font-bold text-zinc-900 hover:text-rose-500 duration-200">
          Desabafo Anônimo
        </h1>
      </Link>
      <div className="flex items-center gap-3">
        <a
          href="https://cvv.org.br"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-xs md:text-sm font-medium text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 px-3 py-1.5 rounded-full transition duration-200"
          title="Centro de Valorização da Vida - Apoio 24h gratuito"
        >
          <FaPhoneAlt className="text-xs" />
          <span>
            Apoio 24h: <strong>188</strong> (CVV)
          </span>
        </a>
      </div>
    </aside>
  );
}
