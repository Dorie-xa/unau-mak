import Link from "next/link";
import { getAdminSession } from "@/lib/auth";
import { adminLogoutAction } from "@/actions/adminAuthActions";
import { listMembers, memberStats } from "@/services/memberService";
import { listProjects } from "@/services/projectService";
import { SDGS } from "@/lib/sdgs";

export default async function AdminDashboardPage() {
  const session = await getAdminSession();
  const [members, stats, projects] = await Promise.all([listMembers(), memberStats(), listProjects()]);
  const totalRegistrations = projects.reduce((sum, p) => sum + p._count.registrations, 0);
  const topSdgName = stats.topSdg ? SDGS.find((s) => s.n === stats.topSdg)?.name : "—";

  return (
    <div className="admin-shell">
      <div className="crud-row" style={{ marginBottom: 20 }}>
        <h1 style={{ margin: 0, fontSize: 22 }}>Registrations Dashboard</h1>
        <div>
          <Link href="/admin/home" className="icon-btn">Manage Homepage</Link>
          <Link href="/admin/projects" className="icon-btn">Manage Projects</Link>
          <form action={adminLogoutAction} style={{ display: "inline" }}>
            <button className="icon-btn danger" type="submit">
              Sign out{session ? ` (${session.name})` : ""}
            </button>
          </form>
        </div>
      </div>

      <div className="grid3" style={{ marginBottom: 22 }}>
        <div className="card">
          <h3 style={{ fontSize: 22, marginBottom: 2 }}>{stats.total}</h3>
          <p style={{ fontSize: 12.5, margin: 0 }}>Total members signed up</p>
        </div>
        <div className="card">
          <h3 style={{ fontSize: 22, marginBottom: 2 }}>{totalRegistrations}</h3>
          <p style={{ fontSize: 12.5, margin: 0 }}>Total project registrations</p>
        </div>
        <div className="card">
          <h3 style={{ fontSize: 22, marginBottom: 2 }}>{topSdgName}</h3>
          <p style={{ fontSize: 12.5, margin: 0 }}>Most selected SDG</p>
        </div>
      </div>

      <h3>Recent members</h3>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>SDGs</th>
            <th>Programme</th>
            <th>Joined</th>
          </tr>
        </thead>
        <tbody>
          {members.slice(0, 25).map((m) => (
            <tr key={m.id}>
              <td>{m.fullName}</td>
              <td>{m.email}</td>
              <td>{m.sdgs.join(", ")}</td>
              <td>{m.programme || "—"}</td>
              <td>{new Date(m.createdAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3 style={{ marginTop: 30 }}>Projects</h3>
      <table>
        <thead>
          <tr>
            <th>Project</th>
            <th>Status</th>
            <th>Registrations</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((p) => (
            <tr key={p.id}>
              <td>{p.name}</td>
              <td>{p.status}</td>
              <td>{p._count.registrations}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
