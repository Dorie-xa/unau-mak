import Link from "next/link";
import { listHomeCards, listFooterLinks, getWelcomeMessage } from "@/services/siteService";
import AdminHomeManager from "@/components/AdminHomeManager";

export default async function AdminHomePage() {
  const [cards, links, welcomeMessage] = await Promise.all([
    listHomeCards(),
    listFooterLinks(),
    getWelcomeMessage(),
  ]);

  return (
    <div className="admin-shell">
      <div className="crud-row" style={{ marginBottom: 20 }}>
        <h1 style={{ margin: 0, fontSize: 22 }}>Manage Homepage</h1>
        <Link href="/admin" className="icon-btn">← Back to dashboard</Link>
      </div>
      <AdminHomeManager cards={cards} links={links} welcomeMessage={welcomeMessage} />
    </div>
  );
}
