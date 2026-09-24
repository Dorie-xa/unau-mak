import Link from "next/link";
import { getAdminSession } from "@/lib/auth";
import { listMembers } from "@/services/memberService";
import AdminSidebar from "@/components/AdminSidebar";
import AdminMemberTable from "@/components/AdminMemberTable";

export default async function AdminMembersPage() {
  const [session, members] = await Promise.all([getAdminSession(), listMembers()]);

  return (
    <div className="admin-layout">
      <AdminSidebar name={session?.name || "Administrator"} />
      <main className="admin-main">
        <div className="admin-page-heading">
          <div>
            <p className="admin-eyebrow">People</p>
            <h1>All members</h1>
            <p>{members.length} member{members.length === 1 ? "" : "s"} registered with the chapter.</p>
          </div>
          <Link href="/admin" className="admin-quiet-action">← Dashboard</Link>
        </div>

        <section className="admin-section admin-section-flush">
          <AdminMemberTable members={members} />
        </section>
      </main>
    </div>
  );
}
