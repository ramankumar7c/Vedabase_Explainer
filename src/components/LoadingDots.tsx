export function LoadingDots({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center space-x-1 ${className}`}>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-2 h-2 bg-current rounded-full animate-pulse"
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </span>
  )
}