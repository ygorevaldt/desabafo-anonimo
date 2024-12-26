import Link from "next/link";

type IaSupportMessageProps = {
  content: string;
};

export function IaSupportMessage({ content }: IaSupportMessageProps) {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="font-bold text-2xl flex items-end flex-nowrap gap-2 ">
          Algumas palavrar de reflexão e apoio
        </h2>
        <span className="text-xs text-zinc-400">Mensagem gerada por IA</span>
      </div>
      <div className="flex flex-col gap-8 items-end">
        <div
          className="prose prose-lg max-w-none text-justify space-y-6"
          dangerouslySetInnerHTML={{ __html: content }}
        />
        <div className="w-full grid md:inline-block md:w-fit">
          <Link href={"/unburdens"} className="rose-button">
            Tudo bem
          </Link>
        </div>
      </div>
    </div>
  );
}
