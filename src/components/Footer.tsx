import { getWelcomeMessage } from "@/services/siteService";
import { listFooterLinks } from "@/services/siteService";

function linkIcon(label: string, icon: string | null) {
  if (icon) return icon;
  const value = label.toLowerCase();
  if (value.includes("email") || value.includes("mail")) return "✉️";
  if (value.includes("location") || value.includes("address")) return "📍";
  if (value.includes("instagram") || value.includes("social")) return "📷";
  if (value.includes("x") || value.includes("twitter")) return "𝕏";
  if (value.includes("phone") || value.includes("call")) return "📞";
  if (value.includes("whatsapp") || value.includes("chat")) return "💬";
  return "🔗";
}

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
              <span className="footer-contact-row" key={l.id}>
                <span className="footer-contact-icon" aria-hidden="true">{linkIcon(l.label, l.icon)}</span>
                <span><b>{l.label}</b><br />{l.value}</span>
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
