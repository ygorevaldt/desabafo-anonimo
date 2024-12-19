import Link from "next/link";
import { AiOutlineHeart } from "react-icons/ai";

export function Footer() {
  return (
    <footer
      className="
        flex flex-col-reverse gap-2 items-center justify-between
        md:flex md:flex-row
        w-full border-t-2 border-zinc-300
        p-5 bg-white shadow-lg
        z-10"
    >
      <div>
        <p className="text-zinc-500 text-center md:text-start">
          © Copyright 2024. Todos os direitos reservados
        </p>
      </div>
      <div className="flex gap-1 items-center flex-nowrap">
        <div className="flex gap-1 items-center flex-nowrap">
          <p className="text-nowrap">Feito com </p>
          <AiOutlineHeart className="text-red-500" />
          <p>por:</p>
        </div>
        <Link
          href={"https://github.com/ygorevaldt"}
          target="_blank"
          className="font-bold text-nowrap"
        >
          Ygor Evaldt
        </Link>
      </div>
    </footer>
  );
}
