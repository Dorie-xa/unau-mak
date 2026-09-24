import Link from "next/link";
import Image from "next/image";
import { adminLogoutAction } from "@/actions/adminAuthActions";

export default function AdminSidebar({ name }: { name: string }) {
  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar-brand">
        <div className="admin-sidebar-mark">
          <Image className="admin-sidebar-logo" src="/logo.png" alt="UNAU Makerere Chapter logo" width={38} height={38} />
        </div>
        <div>
          <strong>UNAU Mak</strong>
          <span>Admin workspace</span>
        </div>
      </div>

      <nav className="admin-nav" aria-label="Admin navigation">
        <Link href="/admin" className="admin-nav-link admin-nav-link-active">
          <span className="admin-nav-icon">⌂</span>
          Dashboard
        </Link>
        <Link href="/admin/home" className="admin-nav-link">
          <span className="admin-nav-icon">✦</span>
          Homepage
        </Link>
        <Link href="/admin/projects" className="admin-nav-link">
          <span className="admin-nav-icon">▦</span>
          Projects
        </Link>
        <Link href="/admin/members" className="admin-nav-link">
          <span className="admin-nav-icon">♙</span>
          Members
        </Link>
        <Link href="/admin/registrations" className="admin-nav-link">
          <span className="admin-nav-icon">▤</span>
          Registrations
        </Link>
        <Link href="/admin/settings" className="admin-nav-link">
          <span className="admin-nav-icon">⚙</span>
          Settings
        </Link>
      </nav>

      <div className="admin-sidebar-account">
        <div className="admin-avatar">
          <Image className="admin-account-logo" src="/admin-avatar.svg" alt={`${name} profile avatar`} width={42} height={42} />
        </div>
        <div className="admin-account-copy">
          <strong>{name}</strong>
          <span>Administrator</span>
        </div>
        <form action={adminLogoutAction}>
          <button className="admin-signout" type="submit">
            <span aria-hidden="true">↪</span>
            Sign out
          </button>
        </form>
      </div>
    </aside>
  );
}
