import Link from "next/link";
import { listProjects } from "@/services/projectService";
import AdminProjectList from "@/components/AdminProjectList";

export default async function AdminProjectsPage() {
  const projects = await listProjects();

  return (
    <div className="admin-shell">
      <div className="crud-row" style={{ marginBottom: 20 }}>
        <h1 style={{ margin: 0, fontSize: 22 }}>Manage Projects</h1>
        <Link href="/admin" className="icon-btn">← Back to dashboard</Link>
      </div>
      <AdminProjectList projects={projects} />
    </div>
  );
}
