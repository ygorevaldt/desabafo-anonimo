import Link from "next/link";
import { FaFeather } from "react-icons/fa";
import { Istok_Web } from "next/font/google";

import { DinamicPage } from "@/components/DinamicPage";
import { UnburdenList } from "@/components/UnburdenList";

const istokWeb = Istok_Web({ weight: "400", subsets: ["latin"] });

export default function Home() {
  return (
    <DinamicPage
      className="
        flex flex-col gap-16
        justify-center 
        py-20 md:py-10
      "
    >
      <section className="flex flex-col gap-8 justify-center min-h-[calc(100vh-144px)]">
        <header className="text-center">
          <h1 className="text-5xl text-rose-400 p-0">
            Muitas vezes, só precisamos ser ouvidos
          </h1>
        </header>
        <div
          className="
          flex flex-col gap-10
          justify-center items-center
          pb-10 md:pb-0
        "
        >
          <p className="text-center text-zinc-600 text-lg md:w-2/3 m-auto">
            Este é um espaço seguro e anônimo para você se expressar, ser você
            mesmo sem receios. Desabafe sobre qualquer coisa, seus problemas,
            suas angústias, seus sonhos, suas frustrações e conquistas. Aqui
            você será ouvido e apoiado. Encontre acolhimento em cada palavra
            compartilhada, apoio em cada história que se conecta com a sua.
            Desabafe, se expresse, se liberte.
          </p>
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
        </div>
      </section>
      <main className="flex flex-col gap-4 items-start">
        <header className="text-start">
          <h1 className="text-2xl font-semibold text-start">Desabafos</h1>
        </header>
        <UnburdenList />
      </main>
    </DinamicPage>
  );
}
