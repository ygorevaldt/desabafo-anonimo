import { format, formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

type TimeProps = {
  publishedAt: Date;
  className?: string;
};

export function Time({ publishedAt, className }: TimeProps) {
  const publishedAtFormatted = format(
    publishedAt,
    "d 'de' LLLL 'às' HH:mm'h'",
    {
      locale: ptBR,
    },
  );
  const publishedDateRelativeToNow = formatDistanceToNow(publishedAt, {
    locale: ptBR,
    addSuffix: true,
  });

  return (
    <time
      className={`text-nowrap ${className ?? ""}`}
      title={publishedAtFormatted}
      dateTime={publishedAt.toISOString()}
    >
      {publishedDateRelativeToNow}
    </time>
  );
}
