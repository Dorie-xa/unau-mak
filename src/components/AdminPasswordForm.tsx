"use client";

import { useState } from "react";
import { changeAdminPasswordAction } from "@/actions/adminAuthActions";

export default function AdminPasswordForm() {
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<{ text: string; ok: boolean } | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setPending(true);
    setMessage(null);
    const result = await changeAdminPasswordAction(new FormData(form));
    setPending(false);
    setMessage({ text: result.message, ok: result.ok });
    if (result.ok) form.reset();
  }

  return (
    <form className="admin-password-form" onSubmit={handleSubmit}>
      <label>Current password</label>
      <input type="password" name="currentPassword" required autoComplete="current-password" />
      <label>New password</label>
      <input type="password" name="newPassword" required minLength={8} autoComplete="new-password" />
      <label>Confirm new password</label>
      <input type="password" name="confirmPassword" required minLength={8} autoComplete="new-password" />
      {message && <p className={message.ok ? "admin-form-success" : "admin-form-error"}>{message.text}</p>}
      <button className="btn secondary" type="submit" disabled={pending}>
        {pending ? "Updating..." : "Update password"}
      </button>
    </form>
  );
}