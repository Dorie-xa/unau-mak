import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { listProjects } from "@/services/projectService";

const statusLabel: Record<string, { text: string; cls: string }> = {
  OPEN: { text: "Open for registration", cls: "open" },
  COMING_SOON: { text: "Coming soon", cls: "soon" },
  CLOSED: { text: "Closed", cls: "soon" },
};

export default async function ProjectsPage() {
  const projects = await listProjects();

  return (
    <>
      <Header />
      <main>
        <h1>Chapter Projects</h1>
        <p>Projects the Makerere Chapter is currently running or has completed. Tap a project to see details and register.</p>
        <div className="grid3">
          {projects.map((p) => {
            const status = statusLabel[p.status];
            return (
              <div className="proj-card" key={p.id}>
                <div
                  className="proj-banner"
                  style={p.bannerUrl ? { backgroundImage: `url(${p.bannerUrl})` } : undefined}
                />
                <div style={{ padding: 16 }}>
                  <span className={`tag ${status.cls}`}>{status.text}</span>
                  <h3 style={{ marginTop: 8 }}>{p.name}</h3>
                  <p style={{ fontSize: 13 }}>{p.description.slice(0, 110)}{p.description.length > 110 ? "…" : ""}</p>
                  <Link href={`/projects/${p.slug}`} className="btn secondary">
                    View &amp; Register →
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </main>
      <Footer />
    </>
  );
}
