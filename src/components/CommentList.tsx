import { CommentType } from "@/types";
import { FaUserCircle, FaRobot, FaHeart } from "react-icons/fa";
import { Time } from "./Time";

type CommentListProps = {
  comments: CommentType[];
};

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
      {comments.map((comment) => {
        const isAiComfort = comment.content.includes("[Acolhimento Inicial - IA]");
        const cleanContent = isAiComfort
          ? comment.content.replace(/🤖\s*\[Acolhimento Inicial - IA\]\s*/g, "")
          : comment.content;

        return (
          <div
            key={comment.id}
            className={`
              rounded-3xl border p-5 sm:p-6 transition-all duration-200 shadow-soft
              ${
                isAiComfort
                  ? "bg-rose-500/5 dark:bg-rose-950/20 border-rose-300/40 dark:border-rose-900/40"
                  : "bg-card border-border/80"
              }
            `}
          >
            <div className="flex items-center justify-between gap-2 pb-3 mb-2 border-b border-border/50">
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
                <div>
                  <p className="text-xs font-semibold text-foreground">
                    {isAiComfort ? "Acolhimento Inicial (IA)" : "Apoiador(a) Anônimo(a)"}
                  </p>
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
          </div>
        );
      })}
    </div>
  );
}
