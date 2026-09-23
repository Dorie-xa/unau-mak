"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { adminLoginAction } from "@/actions/adminAuthActions";

export default function AdminLoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setError(null);
    const formData = new FormData(e.currentTarget);
    try {
      const result = await adminLoginAction(formData);
      if (result.ok) {
        router.push("/admin");
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
    <main>
      <div className="login-box">
        <Image
          src="/logo.png"
          alt="UNAU Makerere Chapter logo"
          width={52}
          height={51}
          style={{ display: "block", margin: "0 auto 14px", borderRadius: 8, background: "#fff", padding: 3 }}
        />
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

