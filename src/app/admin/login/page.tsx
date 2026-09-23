"use client";

import { useState } from "react";
import { adminLoginAction } from "@/actions/adminAuthActions";

export default function AdminLoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setError(null);
    const formData = new FormData(e.currentTarget);
    const result = await adminLoginAction(formData);
    // adminLoginAction redirects on success (throws internally), so if we get
    // here the login failed.
    if (result && !result.ok) setError(result.message);
    setPending(false);
  }

  return (
    <main>
      <div className="login-box">
        <div className="logo-circle" style={{ width: 52, height: 52, margin: "0 auto 14px", fontSize: 13 }}>
          UN AU
        </div>
        <h1 style={{ textAlign: "center", fontSize: 20 }}>Admin sign in</h1>
        <p style={{ textAlign: "center", fontSize: 13 }}>Restricted to the chapter administrators.</p>
        <form onSubmit={handleSubmit}>
          <label>Admin email</label>
          <input type="email" name="email" required />
          <label>Password</label>
          <input type="password" name="password" required />
          {error && <p style={{ color: "#c5192d", fontSize: 13 }}>{error}</p>}
          <button className="btn secondary" style={{ marginTop: 18, width: "100%" }} type="submit" disabled={pending}>
            {pending ? "Signing in…" : "Sign in to dashboard"}
          </button>
        </form>
      </div>
    </main>
  );
}
