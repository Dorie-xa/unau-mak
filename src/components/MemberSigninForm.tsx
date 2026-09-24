"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { memberLoginAction } from "@/actions/memberAuthActions";

export default function MemberSigninForm({ initialEmail = "", redirectTo = "/" }: { initialEmail?: string; redirectTo?: string }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(null);
    try {
      const result = await memberLoginAction(new FormData(event.currentTarget));
      if (result.ok) {
        router.push(redirectTo);
        router.refresh();
      } else {
        setError(result.message);
        setPending(false);
      }
    } catch (err) {
      setError("Something went wrong signing in. Please try again.");
      setPending(false);
    }
  }

  return (
    <div className="login-box">
      <h1 style={{ textAlign: "center", fontSize: 24 }}>Member sign in</h1>
      <p style={{ textAlign: "center", fontSize: 13 }}>Sign in to continue with UNAU Mak Chapter.</p>
      <form onSubmit={handleSubmit}>
        <label>Email</label>
        <input type="email" name="email" defaultValue={initialEmail} placeholder="you@stud.mak.ac.ug" required autoComplete="email" />
        <label>Password</label>
        <input type="password" name="password" required autoComplete="current-password" />
        {error && <p style={{ color: "#c5192d", fontSize: 13 }}>{error}</p>}
        <button className="btn secondary" style={{ marginTop: 18, width: "100%" }} type="submit" disabled={pending}>
          {pending ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </div>
  );
}
