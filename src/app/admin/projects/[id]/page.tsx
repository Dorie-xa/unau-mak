import Link from "next/link";
import { notFound } from "next/navigation";
import { getProjectById } from "@/services/projectService";
import AdminEditProjectForm from "@/components/AdminEditProjectForm";

export default async function EditProjectPage({ params }: { params: { id: string } }) {
  const project = await getProjectById(params.id);
  if (!project) notFound();

  return (
    <div className="admin-shell">
      <div className="crud-row" style={{ marginBottom: 20 }}>
        <h1 style={{ margin: 0, fontSize: 22 }}>Edit project</h1>
        <Link href="/admin/projects" className="icon-btn">← Back to projects</Link>
      </div>
      <AdminEditProjectForm project={project} />
    </div>
  );
}
