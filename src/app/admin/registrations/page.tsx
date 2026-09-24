import Link from "next/link";
import { getAdminSession } from "@/lib/auth";
import { listProjects } from "@/services/projectService";
import AdminSidebar from "@/components/AdminSidebar";

export default async function AdminRegistrationsPage() {
  const [session, projects] = await Promise.all([getAdminSession(), listProjects()]);

  return (
    <div className="admin-layout">
      <AdminSidebar name={session?.name || "Administrator"} />
      <main className="admin-main">
        <div className="admin-page-heading"><div><p className="admin-eyebrow">Participation</p><h1>Project registrations</h1><p>Choose a project to review its applicants and submitted responses.</p></div><Link href="/admin" className="admin-quiet-action">← Dashboard</Link></div>
        <div className="admin-registration-grid">
          {projects.map((project) => <Link href={`/admin/registrations/${project.id}`} className="admin-registration-card" key={project.id}><div className="admin-registration-card-top"><span className="admin-project-mark">{project.name.slice(0, 1)}</span><span className={`tag ${project.status === "OPEN" ? "open" : "soon"}`}>{project.status === "OPEN" ? "Open" : project.status === "CLOSED" ? "Closed" : "Coming soon"}</span></div><h2>{project.name}</h2><p>{project.description.slice(0, 100)}{project.description.length > 100 ? "..." : ""}</p><strong>{project._count.registrations} registered <span aria-hidden="true">→</span></strong></Link>)}
          {projects.length === 0 && <div className="admin-empty-state">No projects have been created yet.</div>}
        </div>
      </main>
    </div>
  );
}