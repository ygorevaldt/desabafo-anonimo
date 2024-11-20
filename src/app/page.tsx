import Link from "next/link";
import { FaFeather } from "react-icons/fa";
import { Istok_Web } from "next/font/google";

import { DinamicPage } from "@/components/DinamicPage";

const istokWeb = Istok_Web({ weight: "400", subsets: ["latin"] });

export default function Home() {
  return (
    <DinamicPage className="flex flex-col justify-center py-10">
      <article className="flex flex-col gap-8">
        <header className="flex flex-col gap-6 text-center">
          <h1 className="text-5xl text-rose-400">
            Muitas vezes, só precisamos ser ouvidos
          </h1>
        </header>
        <main className="flex flex-col gap-12 justify-center items-center">
          <div
            className={`
              flex flex-col gap-1
              md:w-2/3 m-auto
              ${istokWeb.className} text-zinc-600 text-lg text-center
          `}
          >
            <p>
              Este é um espaço seguro e anônimo para você se expressar, ser você
              mesmo sem receios. Desabafe sobre seus qualquer coisa, sobre seus
              problemas, suas angústias, seus sonhos, suas frustrações e
              conquistas. Aqui você será ouvido e apoiado. Encontre acolhimento
              em cada palavra compartilhada, apoio em cada história que se
              conecta com a sua. Desabafe, se expresse, se liberte.
            </p>
          </div>
          <Link
            href={"/unburden"}
            className="
            rose-button
            flex items-center gap-3
            bg-gradient-to-r from-rose-500 to-rose-300 
            px-8 py-4
            rounded-3xl shadow-md
            text-xl text-white 
            hover:animate-pulse
            active:scale-95
          "
          >
            Desabafar <FaFeather />
          </Link>
        </main>
      </article>
    </DinamicPage>
  );
}
