"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/Toast";
import { updateProjectAction } from "@/actions/adminProjectActions";

type Project = {
  id: string;
  name: string;
  description: string;
  status: "OPEN" | "COMING_SOON" | "CLOSED";
  bannerUrl: string | null;
};

async function uploadImage(file: File): Promise<string> {
  const fd = new FormData();
  fd.append("file", file);
  const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
  if (!res.ok) throw new Error("Upload failed");
  const data = await res.json();
  return data.url as string;
}

export default function AdminEditProjectForm({ project }: { project: Project }) {
  const { show } = useToast();
  const router = useRouter();
  const [banner, setBanner] = useState<File | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    try {
      const formData = new FormData(e.currentTarget);
      if (banner) {
        const url = await uploadImage(banner);
        formData.set("bannerUrl", url);
      }
      await updateProjectAction(project.id, formData);
      show("Project updated.");
      router.push("/admin/projects");
      router.refresh();
    } catch (err) {
      show(err instanceof Error ? err.message : "Could not update project.", false);
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="add-card-form">
      <form onSubmit={handleSubmit}>
        <label>Project name</label>
        <input name="name" defaultValue={project.name} required />
        <label>Description</label>
        <textarea name="description" rows={3} defaultValue={project.description} required />
        <label>Status</label>
        <select name="status" defaultValue={project.status}>
          <option value="OPEN">Open for registration</option>
          <option value="COMING_SOON">Coming soon</option>
          <option value="CLOSED">Closed</option>
        </select>
        <label>Banner image {project.bannerUrl && "(currently set — upload a new one to replace it)"}</label>
        <input type="file" accept="image/*" onChange={(e) => setBanner(e.target.files?.[0] ?? null)} />
        <p style={{ fontSize: 12, marginTop: 4 }}>
          Registration form fields for this project aren&apos;t editable here yet — delete and recreate the
          project from the projects list if the fields need to change.
        </p>
        <button className="btn secondary" style={{ marginTop: 16 }} type="submit" disabled={pending}>
          {pending ? "Saving…" : "Save changes"}
        </button>
      </form>
    </div>
  );
}
