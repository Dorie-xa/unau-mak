"use client";

import { useState } from "react";
import { useToast } from "@/components/Toast";
import { registerForProjectAction } from "@/actions/publicActions";

type Field = {
  id: string;
  label: string;
  type: "TEXT" | "EMAIL" | "TEXTAREA" | "SELECT";
  required: boolean;
  options: string[];
};

export default function ProjectRegisterForm({ slug, fields }: { slug: string; fields: Field[] }) {
  const { show } = useToast();
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    const formData = new FormData(e.currentTarget);
    const result = await registerForProjectAction(slug, formData);
    setPending(false);
    show(result.message, result.ok);
    if (result.ok) e.currentTarget.reset();
  }

  return (
    <div className="card">
      <h3>Register</h3>
      <form onSubmit={handleSubmit}>
        {fields.map((f) => (
          <div key={f.id}>
            <label>{f.label}</label>
            {f.type === "TEXTAREA" ? (
              <textarea name={f.label} rows={3} required={f.required} />
            ) : f.type === "SELECT" ? (
              <select name={f.label} required={f.required}>
                {f.options.map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
            ) : (
              <input type={f.type === "EMAIL" ? "email" : "text"} name={f.label} required={f.required} />
            )}
          </div>
        ))}
        <button className="btn secondary" style={{ marginTop: 18, width: "100%" }} type="submit" disabled={pending}>
          {pending ? "Submitting…" : "Confirm registration"}
        </button>
      </form>
    </div>
  );
}
