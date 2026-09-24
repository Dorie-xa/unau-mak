import Link from "next/link";
import { getAdminSession } from "@/lib/auth";
import { listMembers, memberStats } from "@/services/memberService";
import { listProjects } from "@/services/projectService";
import { SDGS } from "@/lib/sdgs";
import AdminSidebar from "@/components/AdminSidebar";

export default async function AdminDashboardPage() {
  const session = await getAdminSession();
  const [members, stats, projects] = await Promise.all([listMembers(), memberStats(), listProjects()]);
  const totalRegistrations = projects.reduce((sum, p) => sum + p._count.registrations, 0);
  const topSdgName = stats.topSdg ? SDGS.find((s) => s.n === stats.topSdg)?.name : "—";

  return (
    <div className="admin-layout">
      <AdminSidebar name={session?.name || "Administrator"} />
      <main className="admin-main">
        <div className="admin-page-heading">
          <div>
            <p className="admin-eyebrow">Overview</p>
            <h1>Good to see you, {session?.name?.split(" ")[0] || "Admin"}</h1>
            <p>Here is what is happening across the Makerere chapter today.</p>
          </div>
          <Link href="/admin/registrations" className="admin-primary-action">
            <span aria-hidden="true">＋</span> View registrations
          </Link>
        </div>

        <div className="admin-stat-grid">
          <div className="admin-stat-card admin-stat-blue"><span className="admin-stat-icon">♙</span><strong>{stats.total}</strong><span>Registered members</span><small>People in your chapter</small></div>
          <div className="admin-stat-card admin-stat-gold"><span className="admin-stat-icon">▤</span><strong>{totalRegistrations}</strong><span>Project registrations</span><small>Across all chapter projects</small></div>
          <div className="admin-stat-card admin-stat-green"><span className="admin-stat-icon">✦</span><strong>{topSdgName}</strong><span>Top SDG interest</span><small>Most selected by members</small></div>
        </div>

        <section className="admin-section">
          <div className="admin-section-heading"><div><p className="admin-eyebrow">People</p><h2>Recent members</h2></div><Link href="/admin/members" className="admin-text-link">View all</Link></div>
          <div className="admin-table-wrap"><table className="admin-table">
            <thead><tr><th>Name</th><th>Email</th><th>Programme</th><th>Joined</th></tr></thead>
            <tbody>{members.slice(0, 8).map((m) => <tr key={m.id}><td><strong>{m.fullName}</strong></td><td>{m.email}</td><td>{m.programme || "—"}</td><td>{new Date(m.createdAt).toLocaleDateString()}</td></tr>)}</tbody>
          </table></div>
        </section>

        <section className="admin-section">
          <div className="admin-section-heading"><div><p className="admin-eyebrow">Activity</p><h2>Chapter projects</h2></div><Link href="/admin/projects" className="admin-text-link">Manage projects</Link></div>
          <div className="admin-project-grid">{projects.map((p) => <div className="admin-project-row" key={p.id}><div className="admin-project-mark">{p.name.slice(0, 1)}</div><div className="admin-project-copy"><strong>{p.name}</strong><span><span className={`tag ${p.status === "OPEN" ? "open" : "soon"}`}>{p.status === "OPEN" ? "Open" : p.status === "CLOSED" ? "Closed" : "Coming soon"}</span> {p._count.registrations} registrations</span></div><Link href={`/admin/registrations/${p.id}`} className="admin-row-action">View registrations <span aria-hidden="true">→</span></Link></div>)}</div>
        </section>

      </main>
    </div>
  );
}
