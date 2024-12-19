import {
  PiHandHeartThin,
  PiHeartBold,
  PiHeartBreakFill,
  PiHeartFill,
} from "react-icons/pi";

type SupportButtonProps = {
  registerSupport: () => void;
  disabled: boolean;
  className?: string;
};

export function SupportButton({
  registerSupport,
  disabled,
  className,
}: SupportButtonProps) {
  return (
    <>
      {disabled ? (
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
          onClick={registerSupport}
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
