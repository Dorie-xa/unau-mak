import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { listHomeCards } from "@/services/siteService";

export default async function HomePage() {
  const cards = await listHomeCards();

  return (
    <>
      <Header />
      <main>
        <div
          className="hero"
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
            <Link href="/projects/mun" className="btn outline" style={{ color: "#fff", borderColor: "#fff" }}>
              See our current project: MUN
            </Link>
          </div>
        </div>
        <div className="grid3">
          {cards.map((c) => (
            <div className="card" key={c.id}>
              {c.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={c.imageUrl} alt="" style={{ width: "100%", borderRadius: 8, marginBottom: 10 }} />
              ) : null}
              <h3>{c.icon} {c.title}</h3>
              <p style={{ fontSize: 13.5 }}>{c.description}</p>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
