import { registerSupportToUnburden } from "@/http";
import { UnburdenType } from "@/types";
import { errorAlert, infoAlert } from "@/utils/alert";
import { useState } from "react";
import { PiHandHeartThin, PiHeartFill } from "react-icons/pi";

type SupportButtonProps = {
  unburden: UnburdenType;
  className?: string;
  sumSupport: () => void;
};

export function SupportButton({
  unburden,
  className,
  sumSupport,
}: SupportButtonProps) {
  const [isDisabled, setIsDisabled] = useState(unburden.supported);

  async function handleRegisterSupport() {
    try {
      if (unburden.supported) {
        infoAlert("Você já apoiou este desabafo.");
        return;
      }

      await registerSupportToUnburden(unburden);

      sumSupport();

      setIsDisabled(true);
    } catch (error) {
      errorAlert(
        "Serviço indisponível, por favor tente novamente dentro de alguns minutos",
      );
      console.error(error);
    }
  }

  return (
    <>
      {isDisabled ? (
        <span className="flex gap-1 items-center">
          Apoiado <PiHeartFill className="text-red-600" />
        </span>
      ) : (
        <button
          title="Apoiar"
          className={`
            group
            special-rose-button 
            flex items-center gap-2
            ${className}
          `}
          onClick={handleRegisterSupport}
        >
          <span className="text-red-500 group-hover:text-white duration-300">
            <PiHandHeartThin size={25} />
          </span>
          Apoiar
        </button>
      )}
    </>
  );
}
