/** Splits text into masked words for the [data-words] rise-in. */
export function Words({ text, className = "" }: { text: string; className?: string }) {
  return (
    <span className={className}>
      {text.split(" ").map((w, i, arr) => (
        <span key={i} className="w inline-block overflow-hidden pb-[0.12em] align-top -mb-[0.12em]">
          <span className="inline-block">
            {w}
            {i < arr.length - 1 ? " " : ""}
          </span>
        </span>
      ))}
    </span>
  );
}
