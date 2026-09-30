"use client";

import { registerSupportToUnburden } from "@/http";
import { UnburdenType } from "@/types";
import { errorAlert, infoAlert } from "@/utils/alert";
import { useState } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useAppDispatch } from "@/store/hooks";
import { optimisticSupport } from "@/store/slices/feedSlice";
import { optimisticSupportActive } from "@/store/slices/activeUnburdenSlice";

type SupportButtonProps = {
  unburden: UnburdenType;
  className?: string;
  sumSupport?: () => void;
};

export function SupportButton({
  unburden,
  className = "",
  sumSupport,
}: SupportButtonProps) {
  const dispatch = useAppDispatch();
  const [isSupported, setIsSupported] = useState(unburden.supported);
  const [isLoading, setIsLoading] = useState(false);

  async function handleRegisterSupport(e?: React.MouseEvent) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (isSupported) {
      infoAlert("Você já apoiou este desabafo.");
      return;
    }

    try {
      setIsLoading(true);

      setIsSupported(true);
      dispatch(optimisticSupport(unburden.id));
      dispatch(optimisticSupportActive());
      sumSupport?.();

      await registerSupportToUnburden(unburden);
    } catch (error) {
      setIsSupported(false);
      errorAlert(
        "Não foi possível registrar o apoio. Por favor, tente novamente.",
      );
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  if (isSupported) {
    return (
      <div
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-1.5 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-300/40 dark:border-rose-800/40 select-none ${className}`}
      >
        <FaHeart className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
        <span>Apoiado</span>
      </div>
    );
  }

  return (
    <button
      type="button"
      title="Apoiar este desabafo"
      disabled={isLoading}
      onClick={handleRegisterSupport}
      className={`
        group/btn relative inline-flex items-center gap-1.5
        px-3 py-1.5 sm:px-3.5 sm:py-1.5 rounded-full text-xs font-semibold
        bg-card hover:bg-rose-50 dark:hover:bg-rose-950/40
        text-foreground hover:text-rose-600 dark:hover:text-rose-400
        border border-border/80 hover:border-rose-400/50
        shadow-soft hover:shadow-soft-md
        transition-all duration-200 active:scale-95
        disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer
        ${className}
      `}
    >
      <FaRegHeart className="w-3.5 h-3.5 text-rose-500 group-hover/btn:scale-110 transition-transform duration-200" />
      <span>Apoiar</span>
    </button>
  );
}
