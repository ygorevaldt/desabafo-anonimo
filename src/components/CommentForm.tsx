"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import { FaHeart, FaSpinner, FaPaperPlane } from "react-icons/fa";
import { successAlert } from "@/utils/alert";
import { handleApiFormError } from "@/utils/handle-api-form-error.util";
import { CommentType } from "@/types";
import { registerComment } from "@/http";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { useAppDispatch } from "@/store/hooks";
import { addComment } from "@/store/slices/activeUnburdenSlice";
import { incrementFeedCommentCount } from "@/store/slices/feedSlice";
import {
  COMMENT_CONTENT_MIN_LENGTH,
  COMMENT_CONTENT_MAX_LENGTH,
} from "@/constants/validation.constants";

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
    if (
      isLoading ||
      !content.trim() ||
      content.length < COMMENT_CONTENT_MIN_LENGTH
    )
      return;

    setIsLoading(true);

    try {
      const newComment = await registerComment({
        unburden_id: unburdenId,
        content: content.trim(),
      });

      dispatch(addComment(newComment));
      dispatch(incrementFeedCommentCount({ unburdenId }));
      onCommentRegistered?.(newComment);
      successAlert("Sua mensagem de apoio foi enviada.");
      setContent("");
    } catch (error) {
      handleApiFormError(error, {
        badRequestFallback: `O comentário deve ter no mínimo ${COMMENT_CONTENT_MIN_LENGTH} caracteres.`,
      });
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
          maxLength={COMMENT_CONTENT_MAX_LENGTH}
          minLength={COMMENT_CONTENT_MIN_LENGTH}
          className="rounded-2xl"
        />
        <div className="flex justify-between items-center text-[11px] text-muted-foreground px-1">
          <span>Mínimo de {COMMENT_CONTENT_MIN_LENGTH} caracteres</span>
          <span>
            {content.length}/{COMMENT_CONTENT_MAX_LENGTH}
          </span>
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          type="submit"
          variant="warm"
          size="sm"
          disabled={isLoading || content.length < COMMENT_CONTENT_MIN_LENGTH}
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
