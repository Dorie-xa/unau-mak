import { getWelcomeMessage } from "@/services/siteService";
import { listFooterLinks } from "@/services/siteService";

export default async function Footer() {
  const [message, links] = await Promise.all([getWelcomeMessage(), listFooterLinks()]);

  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div>
          <h3>A word from the Chapter</h3>
          <p>{message}</p>
        </div>
        <div>
          <h3>Get in touch</h3>
          <p>
            {links.map((l) => (
              <span key={l.id}>
                {l.label}: {l.value}
                <br />
              </span>
            ))}
          </p>
        </div>
      </div>
      <div className="footer-bottom">© {new Date().getFullYear()} UNAU Makerere Chapter</div>
    </footer>
  );
}
