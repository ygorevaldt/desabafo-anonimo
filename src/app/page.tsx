import { Istok_Web } from "next/font/google";

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
          Salve este site nos seus favoritos e nos visite em alguns dias, há
          grande chances de este ser um de seus lugares preferidos na internet.
        </p>
      </main>
    </article>
  );
}
