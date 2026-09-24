import Link from "next/link";
import { getAdminSession } from "@/lib/auth";
import AdminPasswordForm from "@/components/AdminPasswordForm";
import AdminEmailForm from "@/components/AdminEmailForm";
import AdminSidebar from "@/components/AdminSidebar";

export default async function AdminSettingsPage() {
  const session = await getAdminSession();

  return (
    <div className="admin-layout">
      <AdminSidebar name={session?.name || "Administrator"} />
      <main className="admin-main">
        <div className="admin-page-heading">
          <div>
            <p className="admin-eyebrow">Account</p>
            <h1>Settings</h1>
            <p>Manage your administrator account and security preferences.</p>
          </div>
          <Link href="/admin" className="admin-quiet-action">← Dashboard</Link>
        </div>

        <section className="admin-section admin-section-flush">
          <div className="admin-settings-card">
            <div>
              <h3>Change your password</h3>
              <p>Keep your administrator account secure with a new password.</p>
            </div>
            <AdminPasswordForm />
          </div>
          <div className="admin-settings-card admin-settings-card-spaced">
            <div>
              <h3>Change your email</h3>
              <p>Update the email address you use to sign in to the admin area.</p>
            </div>
            <AdminEmailForm currentEmail={session?.email || ""} />
          </div>
        </section>
      </main>
    </div>
  );
}