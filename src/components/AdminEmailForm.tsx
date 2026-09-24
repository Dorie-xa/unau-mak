"use client";

import { useState } from "react";
import { changeAdminEmailAction } from "@/actions/adminAuthActions";

export default function AdminEmailForm({ currentEmail }: { currentEmail: string }) {
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<{ text: string; ok: boolean } | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setPending(true);
    setMessage(null);
    const result = await changeAdminEmailAction(new FormData(form));
    setPending(false);
    setMessage({ text: result.message, ok: result.ok });
    if (result.ok) form.reset();
  }

  return (
    <form className="admin-password-form" onSubmit={handleSubmit}>
      <label>Current email</label>
      <input type="email" value={currentEmail} readOnly />
      <label>New email</label>
      <input type="email" name="newEmail" required autoComplete="email" />
      <label>Current password</label>
      <input type="password" name="currentPassword" required autoComplete="current-password" />
      {message && <p className={message.ok ? "admin-form-success" : "admin-form-error"}>{message.text}</p>}
      <button className="btn secondary" type="submit" disabled={pending}>
        {pending ? "Updating..." : "Update email"}
      </button>
    </form>
  );
}