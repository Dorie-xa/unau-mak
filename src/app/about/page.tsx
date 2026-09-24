import Link from "next/link";
import { redirect } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getMemberSession } from "@/lib/auth";

const activities = [
  {
    number: "01",
    title: "Public education",
    description: "Local workshops, educational seminars and regional Model United Nations conferences that build knowledge and youth leadership.",
  },
  {
    number: "02",
    title: "Policy advocacy",
    description: "Encouraging governments to uphold international law, human rights, humanitarian aid and their commitments to global cooperation.",
  },
  {
    number: "03",
    title: "Community action",
    description: "Mobilizing civic groups to take practical action on environmental, safety and development priorities in their communities.",
  },
];

export default async function AboutPage() {
  const member = await getMemberSession();
  if (!member) redirect("/signin?redirect=/about");

  return (
    <>
      <Header />
      <main className="about-page">
        <section className="about-hero">
          <p className="member-home-kicker">About the movement</p>
          <h1>Connecting people to the work of the United Nations.</h1>
          <p>United Nations Associations are national, non-governmental organizations that act as a vital bridge between citizens and the United Nations.</p>
        </section>

        <section className="about-section about-purpose">
          <div>
            <p className="about-label">The UNA mission</p>
            <h2>Global ideas, understood locally.</h2>
          </div>
          <div>
            <p>UNAs raise public awareness about the UN&apos;s work, advocate for global peace and cooperation, and mobilize civil society around shared goals such as the Sustainable Development Goals.</p>
            <p>UNA chapters around the world are represented and coordinated by the <a href="https://wfuna.org/" target="_blank" rel="noopener noreferrer">World Federation of United Nations Associations (WFUNA) ↗</a>.</p>
          </div>
        </section>

        <section className="about-section">
          <div className="about-section-heading">
            <p className="about-label">How UNAs contribute</p>
            <h2>Awareness becomes action.</h2>
          </div>
          <div className="about-activity-grid">
            {activities.map((activity) => (
              <article className="about-activity" key={activity.number}>
                <span>{activity.number}</span>
                <h3>{activity.title}</h3>
                <p>{activity.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="about-uganda">
          <div>
            <p className="about-label">Our national association</p>
            <h2>United Nations Association of Uganda</h2>
          </div>
          <div>
            <p>The United Nations Association of Uganda (UNAU) drives grassroots SDG acceleration, works with the Sports for National Development Consortium, and hosts the annual Uganda Model United Nations conference.</p>
            <a className="btn secondary" href="https://unauganda.org/" target="_blank" rel="noopener noreferrer">Visit UNAU Uganda ↗</a>
          </div>
        </section>

        <div className="about-footer-actions">
          <Link href="/" className="admin-quiet-action">← Home</Link>
          <Link href="/projects" className="btn">Explore projects</Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
