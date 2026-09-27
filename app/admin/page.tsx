import AdminPanel from "./AdminPanel";

export const metadata = {
  title: "BetBass Admin",
  robots: { index: false, follow: false }
};

export default function AdminPage() {
  return <AdminPanel />;
}
