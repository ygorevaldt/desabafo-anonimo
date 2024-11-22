import Link from "next/link";
import { AiOutlineHeart } from "react-icons/ai";

export function Footer() {
  return (
    <footer
      className="
        w-full border-t-2 border-zinc-300
        flex gap-1 items-center justify-between
        p-5 bg-white shadow-lg
        z-10"
    >
      <div>
        <p className="text-zinc-500">
          © Copyright 2024. Todos os direitos reservados
        </p>
      </div>
      <div className="flex gap-1 items-center">
        <div className="flex gap-1 items-center">
          <p>Feito com </p>
          <AiOutlineHeart className="text-red-500" />
          <p>por:</p>
        </div>
        <Link
          href={"https://github.com/ygorevaldt"}
          target="_blank"
          className="font-bold"
        >
          Ygor Evaldt
        </Link>
      </div>
    </footer>
  );
}
