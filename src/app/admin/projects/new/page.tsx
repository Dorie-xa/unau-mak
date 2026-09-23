import Link from "next/link";
import AdminNewProjectForm from "@/components/AdminNewProjectForm";

export default function NewProjectPage() {
  return (
    <div className="admin-shell">
      <div className="crud-row" style={{ marginBottom: 20 }}>
        <h1 style={{ margin: 0, fontSize: 22 }}>Add a new project</h1>
        <Link href="/admin/projects" className="icon-btn">← Back to projects</Link>
      </div>
      <AdminNewProjectForm />
    </div>
  );
}
