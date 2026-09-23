"use client";

import { useTransition } from "react";
import Link from "next/link";
import { useToast } from "@/components/Toast";
import { deleteProjectAction } from "@/actions/adminProjectActions";

type Project = { id: string; name: string; status: string; _count: { registrations: number } };

const statusLabel: Record<string, string> = { OPEN: "Open", COMING_SOON: "Coming soon", CLOSED: "Closed" };

export default function AdminProjectList({ projects }: { projects: Project[] }) {
  const { show } = useToast();
  const [isPending, startTransition] = useTransition();

  return (
    <div className="crud-list" id="projList">
      {projects.map((p) => (
        <div className="crud-row" key={p.id}>
          <div className="meta">
            <b>{p.name}</b>
            <span>
              <span className={`tag ${p.status === "OPEN" ? "open" : "soon"}`}>{statusLabel[p.status]}</span>
              {" · "}
              {p._count.registrations} registered
            </span>
          </div>
          <div>
            <Link href={`/admin/projects/${p.id}`} className="icon-btn">Edit</Link>
            <button
              className="icon-btn danger"
              disabled={isPending}
              onClick={() =>
                startTransition(async () => {
                  await deleteProjectAction(p.id);
                  show("Project deleted.");
                })
              }
            >
              Delete
            </button>
          </div>
        </div>
      ))}
      {projects.length === 0 && <p style={{ fontSize: 13 }}>No projects yet.</p>}
      <Link href="/admin/projects/new" className="btn secondary" style={{ marginTop: 10, width: "fit-content" }}>
        + Add a new project
      </Link>
    </div>
  );
}
