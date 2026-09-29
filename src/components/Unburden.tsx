import { UnburdenType } from "@/types/unburden.type";
import { FaEye, FaEyeSlash, FaHashtag, FaFlag, FaPhoneAlt } from "react-icons/fa";
import { Time } from "./Time";
import { SupportsAmount } from "./SupportsAmount";
import { CommentsAmount } from "./CommentsAmount";
import { useState } from "react";
import { confirmReportAlert, successAlert } from "@/utils/alert";

type UnburdenProps = {
  data: UnburdenType;
  className?: string;
  showSensitiveButton?: boolean;
};

export function Unburden({
  data,
  className,
  showSensitiveButton,
}: UnburdenProps) {
  const [showSensitiveContent, setShowSensitiveContent] = useState(false);
  const [reported, setReported] = useState(false);

  function handleShowSensitiveContent() {
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
      setReported(true);
      successAlert(
        "Obrigado. Este desabafo foi enviado para análise da moderação."
      );
    }
  }

  return (
    <div
      className={`
        flex flex-col gap-4
        border-2 border-zinc-200 
        rounded-lg p-5 pb-2
        shadow-sm hover:shadow-md
        bg-white transition duration-200
        ${className}
      `}
    >
      <div className="md:flex md:flex-row flex flex-col-reverse justify-between items-start">
        <h1
          className="
            text-xl font-bold text-rose-500
            flex items-start gap-1 pt-2
          "
        >
          {<FaHashtag />} {data.title}
        </h1>
        <div className="w-full md:w-fit flex justify-end">
          <Time
            publishedAt={new Date(data.created_at)}
            className="text-zinc-400 text-xs"
          />
        </div>
      </div>

      {data.sensitive_content ? (
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between bg-amber-50 border border-amber-200 text-amber-800 text-xs px-3 py-2 rounded-md">
            <span className="font-medium">
              ⚠️ Contém temas sensíveis ou desabafo de dor profunda
            </span>
            <a
              href="https://cvv.org.br"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 font-semibold text-rose-600 hover:underline"
              onClick={(e) => e.stopPropagation()}
            >
              <FaPhoneAlt className="text-[10px]" /> Apoio 188
            </a>
          </div>

          <div className="flex flex-col items-start justify-start relative">
            <div
              className={`${showSensitiveContent ? "blur-none" : "blur-sm select-none"} relative w-full`}
            >
              <p className="whitespace-pre-wrap">{data.content}</p>
            </div>
            {!showSensitiveContent && (
              <div className="absolute inset-[-4px] text-sm flex items-center justify-center bg-white/70 backdrop-blur-[2px] text-zinc-800 rounded">
                <span className="bg-zinc-800 text-white px-3 py-1 rounded-full text-xs font-medium">
                  Clique no ícone abaixo para visualizar
                </span>
              </div>
            )}
            {showSensitiveButton && (
              <button
                type="button"
                onClick={handleShowSensitiveContent}
                className="z-20 m-auto mt-4 text-xs flex items-center gap-1.5 text-zinc-600 hover:text-zinc-900 bg-zinc-100 hover:bg-zinc-200 px-3 py-1.5 rounded-full transition"
              >
                {showSensitiveContent ? (
                  <>
                    <FaEyeSlash size={14} /> Ocultar conteúdo sensível
                  </>
                ) : (
                  <>
                    <FaEye size={14} /> Visualizar conteúdo sensível
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      ) : (
        <p className="px-1 whitespace-pre-wrap text-zinc-800">{data.content}</p>
      )}

      <div className="text-xs mt-2 pt-2 border-t border-zinc-100 flex items-center justify-between text-zinc-400">
        <button
          type="button"
          onClick={handleReport}
          title="Denunciar conteúdo abusivo ou proibido"
          className="flex items-center gap-1 hover:text-rose-500 transition text-[11px]"
        >
          <FaFlag size={10} className={reported ? "text-rose-500" : ""} />
          <span>{reported ? "Sinalizado" : "Denunciar"}</span>
        </button>

        <div className="flex items-center gap-4">
          <CommentsAmount
            amount={data.comments_amount}
            className="text-zinc-400"
          />
          <SupportsAmount
            amount={data.supports_amount}
            className="text-zinc-400"
          />
        </div>
      </div>
    </div>
  );
}
