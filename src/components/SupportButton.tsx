import { UnburdenType } from "@/types/unburden.type";
import { PiHandHeartThin } from "react-icons/pi";

type SupportButtonProps = {
  registerSupport: () => void;
};

export function SupportButton({ registerSupport }: SupportButtonProps) {
  function handleSupportUnburden() {
    console.log("Desabafo apoiado");
  }

  return (
    <button
      title="Apoiar"
      className="
        group
        special-rose-button 
        flex items-center gap-2
      "
      onClick={registerSupport}
    >
      <span className="text-red-500 group-hover:text-white duration-300">
        <PiHandHeartThin size={25} />
      </span>
      Apoiar
    </button>
  );
}
