import Link from "next/link";
import { notFound } from "next/navigation";
import { getAdminSession } from "@/lib/auth";
import { getProjectById, listRegistrations } from "@/services/projectService";
import AdminSidebar from "@/components/AdminSidebar";
import AdminRegistrationTable from "@/components/AdminRegistrationTable";

export default async function AdminProjectRegistrationsPage({ params }: { params: { id: string } }) {
  const project = await getProjectById(params.id);
  if (!project) notFound();
  const [session, registrations] = await Promise.all([getAdminSession(), listRegistrations(params.id)]);

  return (
    <div className="admin-layout">
      <AdminSidebar name={session?.name || "Administrator"} />
      <main className="admin-main">
        <div className="admin-page-heading"><div><p className="admin-eyebrow">Project registrations</p><h1>{project.name}</h1><p>{registrations.length} people have registered for this project.</p></div><Link href="/admin/registrations" className="admin-quiet-action">← All registrations</Link></div>
        <section className="admin-section admin-section-flush"><AdminRegistrationTable registrations={registrations} /></section>
      </main>
    </div>
  );
}