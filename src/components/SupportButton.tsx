import supportSvg from "@/assets/support.svg";
console.log("suportSVG", supportSvg);

export function SupportButton() {
  function handleSupportUnburden() {
    console.log("Desabafo apoiado");
  }

  return (
    <button
      title="Apoiar"
      className="
        border-2 border-transparent rounded-full
        hover:border-rose-400 
        duration-300
      "
      onClick={handleSupportUnburden}
    >
      <img width={30} src={supportSvg.src} alt="Apoio" />
    </button>
  );
}
