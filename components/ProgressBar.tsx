export function ProgressBar({ value }: { value: number }) {
  const safeValue = Math.max(0, Math.min(100, Number(value || 0)));

  return (
    <div className="progress" aria-label={`进度 ${safeValue}%`}>
      <span style={{ width: `${safeValue}%` }} />
    </div>
  );
}
