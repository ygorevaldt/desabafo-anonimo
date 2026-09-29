"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import { FaHeart, FaSpinner, FaPaperPlane } from "react-icons/fa";
import { errorAlert, successAlert } from "@/utils/alert";
import axios from "axios";
import { CommentType } from "@/types";
import { registerComment } from "@/http";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { useAppDispatch } from "@/store/hooks";
import { addComment } from "@/store/slices/activeUnburdenSlice";

type CommentFormProps = {
  unburdenId: string;
  onCommentRegistered?: (comment: CommentType) => void;
};

export function CommentForm({
  unburdenId,
  onCommentRegistered,
}: CommentFormProps) {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [content, setContent] = useState("");

  async function handleSubmitComment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!content.trim() || content.length < 5) return;

    setIsLoading(true);

    try {
      const newComment = await registerComment({
        unburden_id: unburdenId,
        content: content.trim(),
      });

      dispatch(addComment(newComment));
      onCommentRegistered?.(newComment);
      successAlert("Sua mensagem de apoio foi enviada.");
      setContent("");
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        errorAlert(
          "Não foi possível publicar. O conteúdo viola as diretrizes de acolhimento e segurança.",
        );
        return;
      }
      errorAlert(
        "Serviço temporariamente indisponível. Tente novamente em alguns minutos.",
      );
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  function handleContentChange(event: ChangeEvent<HTMLTextAreaElement>) {
    setContent(event.target.value);
  }

  return (
    <form
      onSubmit={handleSubmitComment}
      className="bg-card border border-border/80 rounded-3xl p-6 sm:p-7 shadow-soft flex flex-col gap-4"
    >
      <header className="flex flex-col gap-1">
        <h3 className="font-bold text-lg text-foreground flex items-center gap-2">
          <FaHeart className="text-rose-500 w-4 h-4 animate-pulse" />
          <span>Enviar uma mensagem de apoio</span>
        </h3>
        <p className="text-xs text-muted-foreground">
          Palavras sinceras de afeto podem transformar o dia de alguém. Seja gentil e empático(a).
        </p>
      </header>

      <div className="flex flex-col gap-2">
        <Textarea
          rows={3}
          placeholder="Escreva palavras acolhedoras de conforto aqui..."
          value={content}
          onChange={handleContentChange}
          required
          maxLength={2500}
          minLength={5}
          className="rounded-2xl"
        />
        <div className="flex justify-between items-center text-[11px] text-muted-foreground px-1">
          <span>Mínimo de 5 caracteres</span>
          <span>{content.length}/2500</span>
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          type="submit"
          variant="warm"
          size="sm"
          disabled={isLoading || content.length < 5}
          className="gap-2 font-semibold shadow-soft"
        >
          {isLoading ? (
            <>
              <FaSpinner className="w-3.5 h-3.5 animate-spin" />
              <span>Enviando apoio...</span>
            </>
          ) : (
            <>
              <FaPaperPlane className="w-3 h-3" />
              <span>Apoiar com mensagem</span>
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
