import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProjectRegisterForm from "@/components/ProjectRegisterForm";
import { getProjectBySlug } from "@/services/projectService";

export default async function ProjectDetailPage({ params }: { params: { slug: string } }) {
  const project = await getProjectBySlug(params.slug);
  if (!project) notFound();

  const infoLinks = (project.infoLinks as { label: string; url: string }[] | null) ?? [];

  return (
    <>
      <Header />
      <main>
        <div className="mun-hero" style={project.bannerUrl ? { backgroundImage: `url(${project.bannerUrl})`, backgroundSize: "cover" } : undefined}>
          <span style={{ background: "rgba(255,255,255,0.15)", padding: "3px 9px", borderRadius: 20, fontSize: 11, fontWeight: 700 }}>
            Current Chapter Project
          </span>
          <h1 style={{ marginTop: 10 }}>{project.name}</h1>
          <p style={{ maxWidth: 600 }}>{project.description}</p>
        </div>
        <div className="grid2">
          <div>
            {infoLinks.length > 0 && (
              <>
                <h3>Learn more before you register</h3>
                <div className="video-row">
                  {infoLinks.map((link) => (
                    <a key={link.url} className="video-card" href={link.url} target="_blank" rel="noopener noreferrer">
                      <b>{link.label}</b>
                      <br />
                      <span style={{ fontSize: 12, color: "var(--ink-soft)" }}>Opens in a new tab</span>
                    </a>
                  ))}
                </div>
              </>
            )}
          </div>
          <ProjectRegisterForm slug={project.slug} fields={project.fields} />
        </div>
      </main>
      <Footer />
    </>
  );
}
