import { Istok_Web } from "next/font/google";
import { PiHeartFill } from "react-icons/pi";

const istokWeb = Istok_Web({ weight: "400", subsets: ["latin"] });

export default function Home() {
  return (
    <article
      className="
      flex flex-col gap-8 items-center justify-center
      max-w-6xl m-auto p-4 h-full
    "
    >
      <header className="flex flex-col gap-6 text-center">
        <h1 className="text-5xl text-rose-400">
          Muitas vezes, só precisamos ser ouvidos
        </h1>
      </header>
      <main>
        <p
          className={`
            w-2/3 m-auto
            ${istokWeb.className} text-zinc-600 text-lg text-center 
          `}
        >
          Estamos desenvolvendo um cantinho na internet para você acessar nos
          momentos que precise desabafar e se sentir apoiado. Salve este
          endereço nos favorítos do seu navegador, ele será muito valioso para
          você no futuro. <PiHeartFill className="text-red-700 inline-block" />
        </p>
      </main>
    </article>
  );
}
