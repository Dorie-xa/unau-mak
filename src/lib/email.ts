import { Resend } from "resend";

// Emailing is opt-in: if RESEND_API_KEY isn't set, we skip sending instead of
// throwing, so signup/registration still succeeds even before email is configured.
// See README "Email confirmations" for setup.

function getClient() {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  return new Resend(key);
}

export async function sendConfirmationEmail(opts: {
  to: string;
  subject: string;
  heading: string;
  bodyLines: string[];
}) {
  const client = getClient();
  const from = process.env.MAIL_FROM || "UNAU Mak Chapter <onboarding@resend.dev>";

  if (!client) {
    console.warn(
      `[email] RESEND_API_KEY not set — skipping email to ${opts.to}. See README "Email confirmations".`
    );
    return { sent: false };
  }

  const html = `
    <div style="font-family:sans-serif;max-width:480px;margin:0 auto;color:#0f2438">
      <h2 style="color:#0e1e66">${opts.heading}</h2>
      ${opts.bodyLines.map((l) => `<p style="color:#41576b;line-height:1.5">${l}</p>`).join("")}
      <p style="color:#a9c2d6;font-size:12px;margin-top:24px">UNAU — Makerere University Chapter</p>
    </div>
  `;

  try {
    await client.emails.send({ from, to: opts.to, subject: opts.subject, html });
    return { sent: true };
  } catch (err) {
    // Never let an email failure break signup/registration — just log it.
    console.error("[email] Failed to send:", err);
    return { sent: false };
  }
}
