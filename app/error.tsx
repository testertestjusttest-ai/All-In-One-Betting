"use client";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <section className="glass w-full max-w-xl rounded-3xl p-8 text-center">
        <p className="text-xs font-bold uppercase tracking-[.2em] text-violet-300">BETBASS</p>
        <h1 className="mt-3 text-3xl font-black">Something went wrong</h1>
        <p className="mt-3 text-sm leading-6 text-white/50">The page could not be loaded right now. Please try again.</p>
        <button onClick={() => reset()} className="mt-6 rounded-2xl bg-white px-5 py-3 text-sm font-bold text-black">Try again</button>
      </section>
    </main>
  );
}
