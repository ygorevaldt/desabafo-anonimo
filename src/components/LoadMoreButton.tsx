import { Button } from "./ui/button";

type LoadMoreButtonParams = {
  action: () => void;
  isLoading?: boolean;
};

export function LoadMoreButton({ action, isLoading }: LoadMoreButtonParams) {
  return (
    <div className="flex justify-center w-full py-4">
      <Button
        variant="secondary"
        size="lg"
        onClick={action}
        disabled={isLoading}
        className="rounded-full px-8 font-semibold shadow-soft hover:shadow-soft-md"
      >
        <span>Carregar Mais</span>
      </Button>
    </div>
  );
}
