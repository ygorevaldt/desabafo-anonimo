type LoadMoreButtonParams = {
  action: () => void;
};

export function LoadMoreButton({ action }: LoadMoreButtonParams) {
  return (
    <button
      onClick={action}
      className="
          group px-2 rounded-lg text-black text-lg
          hover:border-white hover:scale-105 active:scale-95
          duration-200 bg-transparent
        "
    >
      <span
        className="
            text-zinc-500
            group-hover:bg-gradient-to-r group-hover:from-rose-500 group-hover:to-rose-300
            group-hover:bg-clip-text group-hover:text-transparent
            animate-pulse
          "
      >
        Carregar Mais
      </span>
    </button>
  );
}
