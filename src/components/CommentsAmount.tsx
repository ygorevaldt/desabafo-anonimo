type CommentsAmountProps = {
  amount: number;
  className?: string;
};

export function CommentsAmount({ amount, className }: CommentsAmountProps) {
  return (
    <>
      {amount > 0 && (
        <p className={`${className}`}>
          <span className="text-sm">{amount} </span>
          {amount === 1 ? "comentário" : "comentários"}
        </p>
      )}
    </>
  );
}
