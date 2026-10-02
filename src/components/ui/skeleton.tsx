import { cn } from "@/lib/utils";

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-2xl bg-zinc-200/90 dark:bg-zinc-800/90",
        className,
      )}
      {...props}
    />
  );
}

export { Skeleton };
