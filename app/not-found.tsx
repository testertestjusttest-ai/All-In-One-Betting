import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <section className="glass w-full max-w-xl rounded-3xl p-8 text-center">
        <p className="text-5xl font-black gradient-text">404</p>
        <h1 className="mt-3 text-3xl font-black">Platform not found</h1>
        <p className="mt-3 text-sm leading-6 text-white/50">The requested BetBass page is unavailable or the platform is no longer listed.</p>
        <Link href="/" className="mt-6 inline-flex rounded-2xl bg-white px-5 py-3 text-sm font-bold text-black">Back to BetBass</Link>
      </section>
    </main>
  );
}
