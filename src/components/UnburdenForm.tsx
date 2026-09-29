"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import { Loading } from "./Loading";
import { useRouter } from "next/navigation";
import { GiPartyPopper } from "react-icons/gi";
import { FaHeart, FaShieldAlt, FaPhoneAlt } from "react-icons/fa";
import { errorAlert } from "@/utils/alert";
import { registerUnburden } from "@/http";
import axios from "axios";

export function UnburdenForm() {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [isSended, setIsSended] = useState(false);
  const [wantsAiComfort, setWantsAiComfort] = useState(true);
  const [unburden, setUnburden] = useState<{ title: string; content: string }>({
    title: "",
    content: "",
  });

  async function handleSubmitUnburden(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    try {
      if (!unburden) return;

      await registerUnburden({
        ...unburden,
        wantsAiComfort,
      });
      setIsSended(true);

      router.push("/unburdens");
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        errorAlert(
          "Não foi possível publicar. O conteúdo viola nossas diretrizes de segurança (apologia à violência, ódio, abuso ou conteúdo ilegal)."
        );
        return;
      }
      errorAlert(
        "Serviço indisponível, tente novamente dentro de alguns minutos"
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
            Só mais um momento, estamos te redirecionando para a página de
            desabafos.
          </p>
        </div>
      ) : (
        <form
          onSubmit={handleSubmitUnburden}
          className="flex flex-col items-end gap-4 w-full"
        >
          {/* Banner de apoio de emergência CVV */}
          <div className="w-full bg-rose-50 border border-rose-200 rounded-lg p-4 text-sm text-zinc-700 flex flex-col md:flex-row gap-3 items-start md:items-center justify-between">
            <div className="flex items-center gap-2">
              <FaPhoneAlt className="text-rose-500 flex-shrink-0" />
              <span>
                <strong>Precisa de ajuda agora?</strong> O <strong>CVV (Centro de Valorização da Vida)</strong> oferece escuta empática e gratuita 24h.
              </span>
            </div>
            <a
              href="tel:188"
              className="bg-rose-500 hover:bg-rose-600 text-white font-semibold px-4 py-1.5 rounded-full text-xs transition duration-200 whitespace-nowrap self-end md:self-auto"
            >
              Ligue 188 (Grátis)
            </a>
          </div>

          <section className="flex flex-col gap-4 w-full">
            <header>
              <h2 className="text-2xl font-semibold">
                Seu desabafo é importante, escreva o que está sentindo:
              </h2>
              <p className="text-zinc-400 text-md">
                Lembre-se: este é um espaço anônimo. Evite compartilhar
                informações pessoais identificáveis.
              </p>
            </header>
            <input
              className="
              p-2 border-2 border-zinc-300 rounded-lg
              focus:outline-none focus:shadow-md
            "
              type="text"
              placeholder="Digite o título para seu desabafo"
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
              rows={12}
              placeholder="Escreva seu desabafo aqui:"
              value={unburden.content}
              onChange={handleNewContentValue}
              required
              maxLength={2500}
              minLength={25}
            ></textarea>

            {/* Opção de conforto com IA */}
            <div className="flex items-center justify-between p-3 border border-zinc-200 rounded-lg bg-zinc-50">
              <label
                htmlFor="wants-ai-comfort"
                className="flex items-center gap-2.5 cursor-pointer text-sm font-medium text-zinc-700"
              >
                <FaHeart className="text-rose-400" />
                <span>
                  Receber uma mensagem inicial de apoio e acolhimento gerada por IA
                </span>
              </label>
              <input
                id="wants-ai-comfort"
                type="checkbox"
                checked={wantsAiComfort}
                onChange={(e) => setWantsAiComfort(e.target.checked)}
                className="w-4 h-4 text-rose-500 rounded focus:ring-rose-400 cursor-pointer"
              />
            </div>

            {/* Aviso de moderação ativa */}
            <div className="flex items-center gap-2 text-xs text-zinc-500 px-1">
              <FaShieldAlt className="text-emerald-500" />
              <span>
                Espaço protegido por moderação de segurança por IA contra crimes, assédio e apologia à violência.
              </span>
            </div>
          </section>

          <button type="submit" className="rose-button">
            Enviar
          </button>
        </form>
      )}

      {isLoading && <Loading />}
    </>
  );
}
