"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/Toast";
import { createProjectAction } from "@/actions/adminProjectActions";

type FieldRow = { label: string; type: "TEXT" | "EMAIL" | "TEXTAREA" | "SELECT"; required: boolean; options: string };

const defaultFields: FieldRow[] = [
  { label: "Full name", type: "TEXT", required: true, options: "" },
  { label: "Email", type: "EMAIL", required: true, options: "" },
];

async function uploadImage(file: File): Promise<string> {
  const fd = new FormData();
  fd.append("file", file);
  const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
  if (!res.ok) throw new Error("Upload failed");
  const data = await res.json();
  return data.url as string;
}

export default function AdminNewProjectForm() {
  const { show } = useToast();
  const router = useRouter();
  const [fields, setFields] = useState<FieldRow[]>(defaultFields);
  const [banner, setBanner] = useState<File | null>(null);
  const [pending, setPending] = useState(false);

  function updateField(i: number, patch: Partial<FieldRow>) {
    setFields((prev) => prev.map((f, idx) => (idx === i ? { ...f, ...patch } : f)));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    try {
      const formData = new FormData(e.currentTarget);
      if (banner) {
        const url = await uploadImage(banner);
        formData.set("bannerUrl", url);
      }
      fields.forEach((f) => {
        formData.append("fieldLabel", f.label);
        formData.append("fieldType", f.type);
        formData.append("fieldRequired", String(f.required));
        formData.append("fieldOptions", f.options);
      });
      await createProjectAction(formData);
      show("Project created with its own registration form.");
      router.push("/admin/projects");
    } catch (e) {
      show(e instanceof Error ? e.message : "Could not create project.", false);
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="add-card-form">
      <form onSubmit={handleSubmit}>
        <label>Project name</label>
        <input name="name" placeholder="e.g. Youth Climate Summit" required />
        <label>Description</label>
        <textarea name="description" rows={3} placeholder="What is this project about?" required />
        <label>Status</label>
        <select name="status" defaultValue="COMING_SOON">
          <option value="OPEN">Open for registration</option>
          <option value="COMING_SOON">Coming soon</option>
          <option value="CLOSED">Closed</option>
        </select>
        <label>Banner image</label>
        <input type="file" accept="image/*" onChange={(e) => setBanner(e.target.files?.[0] ?? null)} />

        <h3 style={{ marginTop: 20 }}>Registration form for this project</h3>
        <p style={{ fontSize: 12.5, marginTop: -6 }}>Add the exact fields students should fill in — built per project.</p>
        {fields.map((f, i) => (
          <div key={i} style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8 }}>
            <input value={f.label} onChange={(e) => updateField(i, { label: e.target.value })} placeholder="Field label" />
            <select value={f.type} onChange={(e) => updateField(i, { type: e.target.value as FieldRow["type"] })}>
              <option value="TEXT">Text</option>
              <option value="EMAIL">Email</option>
              <option value="TEXTAREA">Textarea</option>
              <option value="SELECT">Dropdown</option>
            </select>
            {f.type === "SELECT" && (
              <input
                value={f.options}
                onChange={(e) => updateField(i, { options: e.target.value })}
                placeholder="Comma-separated options"
              />
            )}
            <label style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, whiteSpace: "nowrap" }}>
              <input
                type="checkbox"
                checked={f.required}
                onChange={(e) => updateField(i, { required: e.target.checked })}
                style={{ width: "auto" }}
              />
              required
            </label>
            <button type="button" className="icon-btn danger" onClick={() => setFields((prev) => prev.filter((_, idx) => idx !== i))}>
              ✕
            </button>
          </div>
        ))}
        <button
          type="button"
          className="icon-btn"
          onClick={() => setFields((prev) => [...prev, { label: "", type: "TEXT", required: true, options: "" }])}
        >
          + Add field
        </button>
        <br />
        <button className="btn secondary" style={{ marginTop: 16 }} type="submit" disabled={pending}>
          {pending ? "Creating…" : "Create project"}
        </button>
      </form>
    </div>
  );
}
