export default function TaskLoading() {
  return (
    <div className="p-6 max-w-3xl space-y-6">
      <div className="h-8 w-32 rounded bg-muted animate-pulse" />
      <div className="space-y-3">
        <div className="h-8 w-3/4 rounded bg-muted animate-pulse" />
        <div className="flex gap-2">
          <div className="h-5 w-16 rounded-full bg-muted animate-pulse" />
          <div className="h-5 w-16 rounded-full bg-muted animate-pulse" />
        </div>
      </div>
      <div className="h-px bg-muted" />
      <div className="grid grid-cols-2 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-1">
            <div className="h-3 w-16 rounded bg-muted animate-pulse" />
            <div className="h-4 w-24 rounded bg-muted animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  )
}
