import Link from "next/link";

export function NavBar() {
  return (
    <aside className="flex items-center justify-between px-10 py-8 border-b-2 border-zinc-300">
      <Link href={"/"}>
        <h1 className="text-[1.65rem] font-bold hover:scale-110 duration-300">
          Desabafo Anônimo
        </h1>
      </Link>
      <ul className="flex items-center justify-end gap-4">
        <li>
          <Link href={"/about"} className={`nav-link`}>
            Sobre
          </Link>
        </li>
        <li>
          <Link href={"/unburdens"} className={`nav-link`}>
            Desabafos
          </Link>
        </li>
      </ul>
    </aside>
  );
}
