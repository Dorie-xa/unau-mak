import Link from "next/link";
import Image from "next/image";
import { getMemberSession } from "@/lib/auth";
import MemberAccountHeader from "@/components/MemberAccountHeader";

export default async function Header() {
  const member = await getMemberSession();

  return (
    <header className="site-header">
      <div className="brand">
        <Image src="/logo.png" alt="UNAU Makerere Chapter logo" width={42} height={41} style={{ borderRadius: 8, background: "#fff", padding: 2 }} />
        <div className="brand-name">
          <b>UNAU — Mak Chapter</b>
          <span>United Nations Association of Uganda</span>
        </div>
      </div>
      {member && (
        <MemberAccountHeader name={member.name} />
      )}
      <nav>
        <Link href="/">Home</Link>
        {member && <Link href="/projects">Projects</Link>}
        {member && <Link href="/about">About UNAU</Link>}
        {!member && <Link href="/signup">Sign Up</Link>}
        {!member && <Link href="/signin">Sign in</Link>}
        {!member && <Link href="/admin/login">Admin</Link>}
      </nav>
    </header>
  );
}
