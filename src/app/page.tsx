import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getMemberSession } from "@/lib/auth";
import { SDGS } from "@/lib/sdgs";

export default async function HomePage() {
  const member = await getMemberSession();

  return (
    <>
      <Header />
      <main className={member ? "member-home-main" : "visitor-home-main"}>
        {member ? (
          <>
            <div className="member-home-intro">
              <div>
                <p className="member-home-kicker">Member learning guide</p>
                <h1>Welcome back, {member.name.split(" ")[0]}.</h1>
                <h2 className="member-home-title">Understand the Sustainable Development Goals</h2>
                <p>Explore the 17 global goals and find the issues you would like to help move forward through UNAU Mak projects.</p>
              </div>
              <a className="member-resource-link" href="https://sdgs.un.org/goals" target="_blank" rel="noopener noreferrer">Read the official UN guide ↗</a>
            </div>
            <section className="sdg-guide" aria-labelledby="sdg-guide-title">
              <div className="sdg-guide-heading"><div><p className="member-home-kicker">The 2030 Agenda</p><h2 id="sdg-guide-title">17 goals, one shared future</h2></div><span>Read, reflect, act</span></div>
              <div className="sdg-guide-grid">
                {SDGS.map((sdg) => <article className="sdg-guide-card" key={sdg.n}><div className="sdg-guide-number" style={{ backgroundColor: sdg.color }}>{sdg.n}</div><div><h3>{sdg.name}</h3><p>{sdg.description}</p></div></article>)}
              </div>
            </section>
          </>
        ) : (
          <>
        <div
          className="hero visitor-hero"
          style={{
            backgroundImage:
              "linear-gradient(120deg, rgba(9,30,46,.92), rgba(11,90,138,.72) 75%), url(/chapter-photo.jpg)",
            backgroundSize: "cover",
            backgroundPosition: "center 30%",
          }}
        >
          <h1>Turning the Sustainable Development Goals into student-led action.</h1>
          <p>
            The UNAU Makerere Chapter connects students to the work of the United Nations through
            advocacy, learning and hands-on projects — starting with Model United Nations.
          </p>
          <div style={{ marginTop: 16, display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Link href="/signup" className="btn">Become a member</Link>
            <Link href="/signup" className="btn outline" style={{ color: "#fff", borderColor: "#fff" }}>See our current project: MUN</Link>
          </div>
        </div>
          </>
        )}
      </main>
      <Footer />
    </>
  );
}
