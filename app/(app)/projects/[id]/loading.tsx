export default function ProjectLoading() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="h-8 w-48 rounded bg-muted animate-pulse" />
        <div className="h-9 w-24 rounded bg-muted animate-pulse" />
      </div>
      <div className="h-64 rounded-lg bg-muted animate-pulse" />
    </div>
  )
}
