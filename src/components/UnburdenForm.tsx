"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import { Loading } from "./Loading";
import { useRouter } from "next/navigation";
import { GiPartyPopper } from "react-icons/gi";
import { errorAlert } from "@/utils/alert";
import { registerUnburden } from "@/http";

export function UnburdenForm() {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [isSended, setIsSended] = useState(false);
  const [unburden, setUnburden] = useState<{ title: string; content: string }>({
    title: "",
    content: "",
  });

  async function handleSubmitUnburden(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    try {
      if (!unburden) return;

      await registerUnburden(unburden);
      setIsSended(true);

      router.push("/unburdens");
    } catch (error) {
      errorAlert(
        "Serviço indisponível, tente novamente dentro de alguns minutos",
      );
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  function handleNewTitleValue(event: ChangeEvent<HTMLInputElement>) {
    setUnburden((currentState) => {
      return { ...currentState, title: event.target.value };
    });
  }

  function handleNewContentValue(event: ChangeEvent<HTMLTextAreaElement>) {
    const contentWithLineBreaks = event.target.value.replace(/\n/g, "\r\n");

    setUnburden((currentState) => {
      return { ...currentState, content: contentWithLineBreaks };
    });
  }

  return (
    <>
      {isSended ? (
        <div className="flex flex-col gap-3 justify-center items-center">
          <h2
            className="
            font-bold text-xl 
            flex items-end flex-nowrap gap-2
          "
          >
            Desabafo registrado com sucesso
            <GiPartyPopper size={30} className="text-rose-400" />
          </h2>
          <p className="text-zinc-500">
            Só mais um momento, estamos te redirecinando para a página de
            desabafos.
          </p>
        </div>
      ) : (
        <form
          onSubmit={handleSubmitUnburden}
          className="flex flex-col items-end gap-4 w-full"
        >
          <section className="flex flex-col gap-4 w-full">
            <header>
              <h2 className="text-2xl font-semibold">
                Seu desabafo é importante, escreva o que está sentindo:
              </h2>
              <p className="text-zinc-400 text-md">
                Lembre-se: este é um espaço anônimo. Evite compartilhar
                informações pessoais sensíveis.
              </p>
            </header>
            <input
              className="
              p-2 border-2 border-zinc-300 rounded-lg
              focus:outline-none focus:shadow-md
            "
              type="text"
              placeholder="Dígite o título para seu desabafo"
              value={unburden.title}
              onChange={handleNewTitleValue}
              required
              maxLength={50}
              minLength={5}
            />
            <textarea
              className="
              m-auto p-2 w-full
              border-2 border-zinc-300 rounded-lg 
              focus:outline-none focus:shadow-md
            "
              rows={15}
              placeholder="Escreva seu desabafo aqui:"
              value={unburden.content}
              onChange={handleNewContentValue}
              required
              maxLength={2500}
              minLength={25}
            ></textarea>
          </section>
          <button type="submit" className="rose-button ">
            Enviar
          </button>
        </form>
      )}

      {isLoading && <Loading />}
    </>
  );
}
