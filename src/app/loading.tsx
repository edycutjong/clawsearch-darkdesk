export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6">
      <div className="flex flex-col items-center gap-4">
        <span className="relative flex h-8 w-8">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sol-green opacity-75" />
          <span className="relative inline-block h-8 w-8 rounded-full bg-sol-green" />
        </span>
        <div className="text-sm font-mono text-sol-muted animate-pulse">
          Loading AI engine...
        </div>
      </div>
    </div>
  );
}
