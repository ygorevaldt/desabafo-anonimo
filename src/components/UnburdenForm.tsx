"use client";

import axios from "axios";
import { ChangeEvent, FormEvent, useState } from "react";
import { Loading } from "./Loading";
import { resolve } from "path";

export function UnburdenForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [unburden, setUnburden] = useState("");

  async function handleSubmitUnburden(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    try {
      if (!unburden) return;

      await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/unburden`, {
        title: "Teste",
        description: unburden,
      });

      setUnburden("");
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  function handleNewUnburdenValue(event: ChangeEvent<HTMLTextAreaElement>) {
    setUnburden(event.target.value);
  }

  return (
    <>
      <form
        onSubmit={handleSubmitUnburden}
        className="flex flex-col items-end gap-4 w-full"
      >
        <section className="flex flex-col gap-4 flex-grow w-full">
          <header>
            <h2 className="text-xl font-semibold">
              Seu desabafo é importante, escreva o que está sentindo:
            </h2>
            <p className="text-zinc-400 text-md">
              Lembre-se: este é um espaço anônimo. Evite compartilhar
              informações pessoais sensíveis.
            </p>
          </header>
          <textarea
            className="
              m-auto p-2 w-full
              border-2 border-zinc-300 rounded-lg 
              focus:outline-none focus:shadow-md
            "
            rows={15}
            placeholder="Escreva seu desabafo aqui:"
            value={unburden}
            onChange={handleNewUnburdenValue}
            required
          ></textarea>
        </section>
        <button type="submit" className="rose-button ">
          Enviar
        </button>
      </form>
      {isLoading && <Loading />}
    </>
  );
}
