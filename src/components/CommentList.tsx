"use client";

import { useState } from "react";
import { CommentType } from "@/types";
import {
  FaUserCircle,
  FaRobot,
  FaHeart,
  FaReply,
  FaPaperPlane,
  FaSpinner,
  FaTimes,
} from "react-icons/fa";
import { Time } from "./Time";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { successAlert } from "@/utils/alert";
import { handleApiFormError } from "@/utils/handle-api-form-error.util";
import { formatRepliesCount } from "@/utils/comment.util";
import { registerCommentReply } from "@/http";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addSubcomment } from "@/store/slices/activeUnburdenSlice";
import { incrementFeedCommentCount } from "@/store/slices/feedSlice";
import {
  isAiComfortComment,
  cleanAiComfortContent,
} from "@/constants/ai-comfort.constant";
import {
  COMMENT_CONTENT_MIN_LENGTH,
  COMMENT_CONTENT_MAX_LENGTH,
} from "@/constants/validation.constants";

type CommentListProps = {
  comments: CommentType[];
};

type CommentItemProps = {
  comment: CommentType;
};

function CommentItem({ comment }: CommentItemProps) {
  const dispatch = useAppDispatch();
  const currentUnburden = useAppSelector(
    (state) => state.activeUnburden.current,
  );
  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const isAiComfort = isAiComfortComment(comment.content);
  const cleanContent = isAiComfort
    ? cleanAiComfortContent(comment.content)
    : comment.content;

  async function handleSendReply() {
    if (
      isLoading ||
      !replyContent.trim() ||
      replyContent.length < COMMENT_CONTENT_MIN_LENGTH
    )
      return;

    setIsLoading(true);

    try {
      const newReply = await registerCommentReply({
        comment_id: comment.id,
        content: replyContent.trim(),
      });

      dispatch(
        addSubcomment({
          parentCommentId: comment.id,
          subcomment: newReply,
        }),
      );

      const unburdenId = currentUnburden?.id || comment.unburden_id;
      if (unburdenId) {
        dispatch(incrementFeedCommentCount({ unburdenId }));
      }

      successAlert("Sua resposta foi enviada.");
      setReplyContent("");
      setIsReplying(false);
    } catch (error) {
      handleApiFormError(error, {
        badRequestFallback: `A resposta deve ter no mínimo ${COMMENT_CONTENT_MIN_LENGTH} caracteres.`,
      });
    } finally {
      setIsLoading(false);
    }
  }

  const subcomments = comment.subcomments ?? [];

  return (
    <div
      className={`
        rounded-3xl border p-5 sm:p-6 transition-all duration-200 shadow-soft flex flex-col gap-4
        ${
          isAiComfort
            ? "bg-rose-500/5 dark:bg-rose-950/20 border-rose-300/40 dark:border-rose-900/40"
            : "bg-card border-border/80"
        }
      `}
    >
      <div className="flex items-center justify-between gap-2 pb-3 border-b border-border/50">
        <div className="flex items-center gap-2">
          {isAiComfort ? (
            <div className="w-7 h-7 rounded-full bg-rose-500/20 flex items-center justify-center text-rose-600 dark:text-rose-300">
              <FaRobot className="w-3.5 h-3.5" />
            </div>
          ) : (
            <div className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center text-muted-foreground">
              <FaUserCircle className="w-4 h-4" />
            </div>
          )}
          <div className="flex items-center gap-2">
            <p className="text-xs font-semibold text-foreground">
              {isAiComfort ? "Acolhimento Inicial (IA)" : "Apoiador(a) Anônimo(a)"}
            </p>
            {isAiComfort && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-500/10 text-rose-600 dark:text-rose-300 border border-rose-500/20">
                📌 Fixado
              </span>
            )}
          </div>
        </div>

        {comment.created_at && (
          <Time
            publishedAt={new Date(comment.created_at)}
            className="text-[11px] text-muted-foreground font-medium"
          />
        )}
      </div>

      <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">
        {cleanContent}
      </p>

      <div className="flex items-center justify-between pt-1">
        <button
          type="button"
          onClick={() => setIsReplying(!isReplying)}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-rose-500 transition-colors"
        >
          <FaReply className="w-3 h-3" />
          <span>{isReplying ? "Cancelar resposta" : "Responder"}</span>
        </button>

        {subcomments.length > 0 && (
          <span className="text-[11px] text-muted-foreground">
            {formatRepliesCount(subcomments.length)}
          </span>
        )}
      </div>

      {isReplying && (
        <div className="mt-2 p-4 rounded-2xl bg-secondary/40 border border-border/80 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-foreground">
              Respondendo ao comentário:
            </span>
            <button
              type="button"
              onClick={() => setIsReplying(false)}
              className="text-muted-foreground hover:text-foreground text-xs"
            >
              <FaTimes className="w-3 h-3" />
            </button>
          </div>

          <Textarea
            rows={2}
            placeholder="Escreva sua resposta acolhedora..."
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            maxLength={COMMENT_CONTENT_MAX_LENGTH}
            className="rounded-xl text-xs"
            autoFocus
          />

          <div className="flex items-center justify-between">
            <span className="text-[10px] text-muted-foreground">
              Mínimo de {COMMENT_CONTENT_MIN_LENGTH} caracteres ({replyContent.length}/{COMMENT_CONTENT_MAX_LENGTH})
            </span>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  setReplyContent("");
                  setIsReplying(false);
                }}
                className="h-8 text-xs px-2.5"
              >
                Cancelar
              </Button>

              <Button
                type="button"
                variant="warm"
                size="sm"
                disabled={isLoading || replyContent.length < COMMENT_CONTENT_MIN_LENGTH}
                onClick={handleSendReply}
                className="h-8 text-xs gap-1.5 px-3"
              >
                {isLoading ? (
                  <>
                    <FaSpinner className="w-3 h-3 animate-spin" />
                    <span>Enviando...</span>
                  </>
                ) : (
                  <>
                    <FaPaperPlane className="w-2.5 h-2.5" />
                    <span>Responder</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {subcomments.length > 0 && (
        <div className="mt-2 pl-3 sm:pl-6 border-l-2 border-border/80 flex flex-col gap-3">
          {subcomments.map((sub) => (
            <div
              key={sub.id}
              className="p-3.5 sm:p-4 rounded-2xl bg-secondary/30 border border-border/60 flex flex-col gap-2"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-secondary flex items-center justify-center text-muted-foreground">
                    <FaUserCircle className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[11px] font-semibold text-foreground">
                    Apoiador(a) Anônimo(a)
                  </span>
                </div>

                {sub.created_at && (
                  <Time
                    publishedAt={new Date(sub.created_at)}
                    className="text-[10px] text-muted-foreground font-medium"
                  />
                )}
              </div>

              <p className="whitespace-pre-wrap text-xs leading-relaxed text-foreground/90 pl-1">
                {sub.content}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function CommentList({ comments }: CommentListProps) {
  if (!comments || comments.length === 0) {
    return (
      <div className="text-center py-10 px-4 rounded-3xl border border-dashed border-border/80 bg-card/40 flex flex-col items-center gap-2">
        <FaHeart className="w-5 h-5 text-rose-400/60" />
        <p className="text-sm text-muted-foreground">
          Nenhuma mensagem de apoio ainda. Seja a primeira pessoa a confortar!
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {comments.map((comment) => (
        <CommentItem key={comment.id} comment={comment} />
      ))}
    </div>
  );
}
