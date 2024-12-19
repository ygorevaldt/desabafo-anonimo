type SupportsAmountProps = {
  amount: number;
  className?: string;
};

export function SupportsAmount({ amount, className }: SupportsAmountProps) {
  return (
    <>
      {amount === 0 ? (
        <p className={`${className}`}>Seja o primeiro a demonstrar apoio</p>
      ) : (
        <p className={`${className}`}>
          <span className="text-sm">{amount} </span>
          {amount === 1 ? "apoio" : "apoios"}
        </p>
      )}
    </>
  );
}
