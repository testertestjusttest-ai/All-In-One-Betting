import type { Metadata } from "next";
import Link from "next/link";
import { localizedAlternates } from "../../lib/seo";

export const metadata: Metadata = {
  title: "বেটিং ও ক্যাসিনো তুলনা ডিরেক্টরি",
  description: "BetBass-এ বেটিং সাইট, অনলাইন ক্যাসিনো, স্পোর্টসবুক, অফার ও প্ল্যাটফর্মের তথ্য তুলনা করুন।",
  alternates: localizedAlternates("/"),
  openGraph: {
    title: "BetBass — বেটিং ও ক্যাসিনো তুলনা",
    description: "বেটিং সাইট, অনলাইন ক্যাসিনো ও স্পোর্টসবুক প্ল্যাটফর্মের তথ্য এক জায়গায় দেখুন।",
    url: "/bn",
    type: "website",
    locale: "bn_BD",
  },
};

export default function BengaliHome() {
  return (
    <main className="min-h-screen px-6 py-12">
      <div className="mx-auto max-w-5xl">
        <Link href="/" className="text-sm text-white/45 hover:text-white">English</Link>
        <header className="mt-10 max-w-4xl">
          <p className="text-xs font-bold uppercase tracking-[.2em] text-violet-300">BETBASS GLOBAL DIRECTORY</p>
          <h1 className="mt-3 text-4xl font-black md:text-6xl">বেটিং ও ক্যাসিনো তুলনা ডিরেক্টরি</h1>
          <p className="mt-5 text-lg leading-8 text-white/55">
            BetBass বিভিন্ন betting site, online casino ও sportsbook platform-এর প্রকাশিত তথ্য, অফার, payment method এবং GEO availability এক জায়গায় তুলনা করতে সাহায্য করে।
          </p>
        </header>

        <section className="mt-10 grid gap-4 md:grid-cols-3">
          {[
            ["/betting-sites", "বেটিং সাইট", "বেটিং প্ল্যাটফর্মের তালিকা ও তুলনা দেখুন।"],
            ["/online-casinos", "অনলাইন ক্যাসিনো", "ক্যাসিনো প্ল্যাটফর্ম ও প্রকাশিত তথ্য দেখুন।"],
            ["/sportsbooks", "স্পোর্টসবুক", "স্পোর্টস betting platform-এর directory দেখুন।"],
          ].map(([href, title, description]) => (
            <Link key={href} href={href} className="rounded-3xl border border-white/10 bg-white/5 p-6 hover:bg-white/[.08]">
              <h2 className="text-xl font-black">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-white/50">{description}</p>
            </Link>
          ))}
        </section>

        <section className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-7">
          <h2 className="text-2xl font-black">গুরুত্বপূর্ণ তথ্য</h2>
          <p className="mt-3 text-sm leading-7 text-white/50">
            Platform eligibility, licensing, offers, payment methods এবং local rules পরিবর্তিত হতে পারে। কোনো platform ব্যবহার করার আগে সংশ্লিষ্ট operator-এর বর্তমান terms ও আপনার দেশের প্রযোজ্য নিয়ম যাচাই করুন।
          </p>
        </section>
      </div>
    </main>
  );
}
