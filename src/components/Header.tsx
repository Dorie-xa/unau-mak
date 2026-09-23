import Link from "next/link";
import Image from "next/image";

export default function Header() {
  return (
    <header className="site-header">
      <div className="brand">
        <Image src="/logo.png" alt="UNAU Makerere Chapter logo" width={42} height={41} style={{ borderRadius: 8, background: "#fff", padding: 2 }} />
        <div className="brand-name">
          <b>UNAU — Mak Chapter</b>
          <span>United Nations Association of Uganda</span>
        </div>
      </div>
      <nav>
        <Link href="/">Home</Link>
        <Link href="/projects">Projects</Link>
        <Link href="/signup">Sign Up</Link>
        <Link href="/admin/login">Admin</Link>
      </nav>
    </header>
  );
}
