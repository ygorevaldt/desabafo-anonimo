"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { FaHeart, FaShieldAlt, FaPhoneAlt, FaFeather, FaSpinner } from "react-icons/fa";
import { successAlert } from "@/utils/alert";
import { handleApiFormError } from "@/utils/handle-api-form-error.util";
import { registerUnburden } from "@/http";
import { useAppDispatch } from "@/store/hooks";
import { addNewUnburden } from "@/store/slices/feedSlice";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Switch } from "./ui/switch";
import {
  TITLE_MIN_LENGTH,
  TITLE_MAX_LENGTH,
  CONTENT_MIN_LENGTH,
  CONTENT_MAX_LENGTH,
} from "@/constants/validation.constants";

export function UnburdenForm() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [wantsAiComfort, setWantsAiComfort] = useState(false);
  const [unburden, setUnburden] = useState({
    title: "",
    content: "",
  });

  async function handleSubmitUnburden(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isLoading || !unburden.title.trim() || !unburden.content.trim()) return;

    setIsLoading(true);

    try {
      const created = await registerUnburden({
        title: unburden.title.trim(),
        content: unburden.content.trim(),
        wantsAiComfort,
      });

      if (created) {
        dispatch(addNewUnburden(created));
      }

      setIsSent(true);
      successAlert("Seu desabafo foi publicado com acolhimento.");
      router.push("/unburdens");
    } catch (error) {
      handleApiFormError(error, {
        unauthorizedMessage:
          "Não foi possível publicar. O conteúdo viola as diretrizes de segurança da comunidade (apologia ao crime, ódio, abuso ou violência).",
        badRequestFallback: "Preencha os campos corretamente.",
        defaultMessage:
          "Serviço temporariamente indisponível. Por favor, tente novamente.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  function handleTitleChange(event: ChangeEvent<HTMLInputElement>) {
    setUnburden((prev) => ({ ...prev, title: event.target.value }));
  }

  function handleContentChange(event: ChangeEvent<HTMLTextAreaElement>) {
    setUnburden((prev) => ({ ...prev, content: event.target.value }));
  }

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col gap-6">
      <div className="w-full bg-rose-500/10 border border-rose-300/40 dark:border-rose-900/50 rounded-3xl p-4 sm:p-5 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between text-xs text-foreground">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-rose-500/20 flex items-center justify-center shrink-0">
            <FaPhoneAlt className="text-rose-600 dark:text-rose-400 text-xs" />
          </div>
          <div>
            <p className="font-semibold text-rose-700 dark:text-rose-300">
              Precisa de acolhimento agora?
            </p>
            <p className="text-muted-foreground">
              O <strong>CVV</strong> oferece escuta empática e sigilosa 24h por dia.
            </p>
          </div>
        </div>
        <a
          href="https://cvv.org.br"
          target="_blank"
          rel="noopener noreferrer"
          className="self-end sm:self-auto bg-rose-500 hover:bg-rose-600 text-white font-semibold px-4 py-2 rounded-full text-xs transition duration-200 shadow-soft"
        >
          Ligue 188 (Grátis)
        </a>
      </div>

      <form
        onSubmit={handleSubmitUnburden}
        className="bg-card border border-border/80 rounded-3xl p-6 sm:p-8 shadow-soft flex flex-col gap-6"
      >
        <header className="flex flex-col gap-1.5 border-b border-border/60 pb-4">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <FaFeather className="text-rose-500 w-5 h-5" />
            <span>Coloque para fora o que está sentindo</span>
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Seu desabafo é 100% anônimo. Não compartilhe senhas ou dados que te identifiquem.
          </p>
        </header>

        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center text-xs font-medium text-foreground">
            <label htmlFor="unburden-title">Título do desabafo</label>
            <span
              className={`text-[11px] ${
                unburden.title.length > TITLE_MAX_LENGTH - 5
                  ? "text-amber-500 font-semibold"
                  : "text-muted-foreground"
              }`}
            >
              {unburden.title.length}/{TITLE_MAX_LENGTH}
            </span>
          </div>
          <Input
            id="unburden-title"
            type="text"
            placeholder="Ex: Não consigo me concentrar hoje..."
            value={unburden.title}
            onChange={handleTitleChange}
            required
            maxLength={TITLE_MAX_LENGTH}
            minLength={TITLE_MIN_LENGTH}
            className="rounded-2xl"
          />
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center text-xs font-medium text-foreground">
            <label htmlFor="unburden-content">Escreva sua história ou sentimento</label>
            <span
              className={`text-[11px] ${
                unburden.content.length > CONTENT_MAX_LENGTH - 100
                  ? "text-amber-500 font-semibold"
                  : "text-muted-foreground"
              }`}
            >
              {unburden.content.length}/{CONTENT_MAX_LENGTH}
            </span>
          </div>
          <Textarea
            id="unburden-content"
            rows={8}
            placeholder="Fale com sinceridade sobre o que está em seu coração..."
            value={unburden.content}
            onChange={handleContentChange}
            required
            maxLength={CONTENT_MAX_LENGTH}
            minLength={CONTENT_MIN_LENGTH}
            className="rounded-2xl resize-y"
          />
        </div>

        <div className="flex items-center justify-between p-4 rounded-2xl bg-secondary/60 border border-border/80">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-rose-500/10 flex items-center justify-center shrink-0 mt-0.5">
              <FaHeart className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">
                Acolhimento imediato por IA
              </p>
              <p className="text-xs text-muted-foreground">
                Receba uma mensagem carinhosa de escuta logo após publicar.
              </p>
            </div>
          </div>
          <Switch
            checked={wantsAiComfort}
            onCheckedChange={setWantsAiComfort}
            id="wants-ai-comfort"
          />
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground px-1">
          <FaShieldAlt className="text-emerald-500 w-3.5 h-3.5 shrink-0" />
          <span>
            Espaço protegido por moderação segura contra abusos, ofensas e apologia à violência.
          </span>
        </div>

        <div className="flex justify-end pt-2">
          <Button
            type="submit"
            variant="warm"
            size="lg"
            disabled={
              isLoading ||
              unburden.title.length < TITLE_MIN_LENGTH ||
              unburden.content.length < CONTENT_MIN_LENGTH
            }
            className="w-full sm:w-auto font-semibold gap-2 shadow-soft hover:shadow-soft-md"
          >
            {isLoading ? (
              <>
                <FaSpinner className="w-4 h-4 animate-spin" />
                <span>Publicando...</span>
              </>
            ) : (
              <>
                <FaFeather className="w-4 h-4" />
                <span>Publicar desabafo</span>
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
