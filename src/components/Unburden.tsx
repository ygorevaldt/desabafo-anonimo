"use client";

import Link from "next/link";
import { UnburdenType } from "@/types/unburden.type";
import { FaEye, FaEyeSlash, FaFlag, FaPhoneAlt, FaComment, FaHeart } from "react-icons/fa";
import { Time } from "./Time";
import { useState } from "react";
import { confirmReportAlert, successAlert, errorAlert } from "@/utils/alert";
import { SupportButton } from "./SupportButton";
import { formatCommentsCount, formatSupportsCount } from "@/utils/comment.util";
import { registerReport } from "@/http/register-report";

type UnburdenProps = {
  data: UnburdenType;
  className?: string;
  showSensitiveButton?: boolean;
  showSupportButton?: boolean;
  titleHref?: string;
  previewMode?: boolean;
};

export function Unburden({
  data,
  className = "",
  showSensitiveButton = true,
  showSupportButton = false,
  titleHref,
  previewMode = false,
}: UnburdenProps) {
  const [showSensitiveContent, setShowSensitiveContent] = useState(false);
  const [reported, setReported] = useState(false);

  function handleShowSensitiveContent(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setShowSensitiveContent(!showSensitiveContent);
  }

  async function handleReport(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    if (reported) {
      successAlert("Este desabafo já foi sinalizado para a moderação.");
      return;
    }

    const confirmed = await confirmReportAlert();
    if (confirmed) {
      try {
        const result = await registerReport({ unburdenId: data.id });
        setReported(true);
        successAlert(result.message);
      } catch {
        errorAlert("Não foi possível enviar a denúncia. Tente novamente.");
      }
    }
  }

  return (
    <article
      className={`
        group relative flex flex-col gap-4
        bg-card text-card-foreground
        border border-border/80 hover:border-rose-400/40
        rounded-3xl p-5 sm:p-7
        shadow-soft hover:shadow-soft-md
        transition-all duration-200
        ${className}
      `}
    >
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1.5 sm:gap-2">
        <h2 className="text-lg sm:text-xl font-bold tracking-tight text-foreground group-hover:text-rose-500 transition-colors flex items-center gap-1.5">
          <span className="text-rose-400/80 text-sm">#</span>
          {titleHref ? (
            <Link
              href={titleHref}
              className="focus:outline-none hover:underline decoration-rose-400/40 underline-offset-4"
            >
              <span className="absolute inset-0" aria-hidden="true" />
              {data.title}
            </Link>
          ) : (
            <span>{data.title}</span>
          )}
        </h2>
        <Time
          publishedAt={new Date(data.created_at)}
          className="text-xs text-muted-foreground shrink-0 font-medium pointer-events-none"
        />
      </div>

      {data.sensitive_content ? (
        <div className="flex flex-col gap-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-300 text-xs px-3.5 py-2.5 rounded-2xl relative z-10">
            <span className="font-medium flex items-center gap-1.5">
              ⚠️ Contém temas delicados ou desabafo sensível
            </span>
            <a
              href="https://cvv.org.br"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 font-semibold text-rose-600 dark:text-rose-400 hover:underline shrink-0"
              onClick={(e) => e.stopPropagation()}
            >
              <FaPhoneAlt className="text-[10px]" /> Apoio 188
            </a>
          </div>

          {previewMode ? (
            <div className="relative overflow-hidden rounded-2xl bg-secondary/40 border border-border/60 h-20 sm:h-24 pointer-events-none select-none">
              <p className="blur-md select-none opacity-30 line-clamp-3 text-sm sm:text-base leading-relaxed text-foreground/90 p-3">
                {data.content}
              </p>
              <div className="absolute inset-0 flex items-center justify-center p-3 bg-card/50 backdrop-blur-[1px]">
                <span className="bg-card text-foreground border border-border px-3.5 py-1.5 rounded-full text-xs font-medium shadow-soft">
                  Conteúdo sensível protegido · Toque para ler
                </span>
              </div>
            </div>
          ) : (
            <div className="relative">
              <div
                className={`${
                  showSensitiveContent ? "blur-none select-text" : "blur-md select-none opacity-40"
                } transition-all duration-300 w-full`}
              >
                <p className="whitespace-pre-wrap break-words text-sm sm:text-base leading-relaxed text-foreground/90">
                  {data.content}
                </p>
              </div>

              {!showSensitiveContent && (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                  <span className="bg-card/90 text-foreground border border-border px-4 py-2 rounded-full text-xs font-medium shadow-soft">
                    Conteúdo sensível protegido
                  </span>
                </div>
              )}

              {showSensitiveButton && (
                <button
                  type="button"
                  onClick={handleShowSensitiveContent}
                  className="mt-3 text-xs inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground bg-secondary hover:bg-muted px-4 py-2 rounded-full border border-border/60 transition-colors relative z-10 cursor-pointer"
                >
                  {showSensitiveContent ? (
                    <>
                      <FaEyeSlash className="w-3.5 h-3.5 text-rose-500" />
                      <span>Ocultar conteúdo sensível</span>
                    </>
                  ) : (
                    <>
                      <FaEye className="w-3.5 h-3.5 text-rose-500" />
                      <span>Visualizar conteúdo sensível</span>
                    </>
                  )}
                </button>
              )}
            </div>
          )}
        </div>
      ) : (
        <p
          className={`${
            previewMode ? "line-clamp-3 sm:line-clamp-4" : "whitespace-pre-wrap"
          } break-words text-sm sm:text-base leading-relaxed text-foreground/90`}
        >
          {data.content}
        </p>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3 pt-3.5 mt-1 border-t border-border/60 text-xs text-muted-foreground">
        <button
          type="button"
          onClick={handleReport}
          title="Denunciar conteúdo abusivo ou proibido"
          className="relative z-10 inline-flex items-center gap-1.5 hover:text-rose-500 transition-colors text-xs text-muted-foreground cursor-pointer"
        >
          <FaFlag className={`w-3 h-3 ${reported ? "text-rose-500" : ""}`} />
          <span>{reported ? "Sinalizado" : "Denunciar"}</span>
        </button>

        <div className="flex flex-wrap items-center gap-3 sm:gap-4 ml-auto">
          {data.comments_amount > 0 && (
            <span className="inline-flex items-center gap-1.5 text-muted-foreground font-medium pointer-events-none">
              <FaComment className="w-3.5 h-3.5 text-muted-foreground/80" />
              <span>{formatCommentsCount(data.comments_amount)}</span>
            </span>
          )}

          <span className="inline-flex items-center gap-1.5 font-medium text-muted-foreground pointer-events-none">
            <FaHeart className={`w-3.5 h-3.5 ${data.supports_amount > 0 ? "text-rose-500" : "text-muted-foreground/60"}`} />
            <span>{formatSupportsCount(data.supports_amount)}</span>
          </span>

          {showSupportButton && (
            <div className="relative z-10">
              <SupportButton unburden={data} />
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
