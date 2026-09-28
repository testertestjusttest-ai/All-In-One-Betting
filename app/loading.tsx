export default function Loading() {
  return (
    <main className="min-h-screen px-6 py-10">
      <div className="mx-auto max-w-7xl">
        <div className="h-6 w-28 animate-pulse rounded bg-white/10" />
        <div className="mt-10 h-14 w-3/4 animate-pulse rounded-2xl bg-white/10" />
        <div className="mt-4 h-5 w-1/2 animate-pulse rounded bg-white/5" />
        <div className="mt-10 grid grid-cols-2 gap-3 lg:grid-cols-2">
          {Array.from({length: 8}, (_, i) => <div key={i} className="glass h-56 animate-pulse rounded-3xl" />)}
        </div>
      </div>
    </main>
  );
}
