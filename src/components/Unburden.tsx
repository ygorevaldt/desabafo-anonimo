import { UnburdenType } from "@/types/unburden.type";
import { FaEye, FaEyeSlash, FaHashtag } from "react-icons/fa";
import { Time } from "./Time";
import { SupportsAmount } from "./SupportsAmount";
import { CommentsAmount } from "./CommentsAmount";
import { useState } from "react";

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

  function handleShowSensitiveContent() {
    setShowSensitiveContent(!showSensitiveContent);
  }

  return (
    <div
      className={`
        flex flex-col gap-4
        border-2 border-zinc-300 
        rounded-lg p-4 pb-1
        shadow-md
        bg-white  
        ${className}
      `}
    >
      <div className="md:flex md:flex-row flex flex-col-reverse justify-between items-start">
        <h1
          className="
            text-xl font-bold text-rose-500
            flex items-start gap-1 pt-4
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
        <div className={`flex flex-col items-start justify-start relative`}>
          <div
            className={`${showSensitiveContent ? "blur-none" : "blur-sm"} relative`}
          >
            <p>{data.content}</p>
          </div>
          {!showSensitiveContent && (
            <div className="absolute inset-[-6px] text-lg flex items-center justify-center bg-white bg-opacity-60 text-black">
              <p className="text-zinc-800 bg-white bg-opacity-60 p-1 rounded-lg ">
                Conteúdo sensível
              </p>
            </div>
          )}
          {showSensitiveButton && (
            <button
              onClick={handleShowSensitiveContent}
              className="z-20 m-auto pt-16"
            >
              {showSensitiveContent ? (
                <FaEyeSlash title="Ocultar" size={25} />
              ) : (
                <FaEye title="Visualizar" size={20} />
              )}
            </button>
          )}
        </div>
      ) : (
        <p className="px-1 whitespace-pre-wrap">{data.content}</p>
      )}
      <div className="text-sm mt-2 flex items-center justify-end gap-4">
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
  );
}
