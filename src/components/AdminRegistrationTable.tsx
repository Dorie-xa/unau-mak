"use client";

import { useTransition } from "react";
import { useToast } from "@/components/Toast";
import { deleteRegistrationAction } from "@/actions/adminRegistrationActions";

type Registration = {
  id: string;
  projectId: string;
  member: { fullName: string; email: string; programme: string | null } | null;
  data: unknown;
  createdAt: Date;
};

function responseEntries(data: unknown) {
  if (!data || typeof data !== "object" || Array.isArray(data)) return [];
  return Object.entries(data as Record<string, unknown>);
}

export default function AdminRegistrationTable({ registrations }: { registrations: Registration[] }) {
  const { show } = useToast();
  const [isPending, startTransition] = useTransition();

  function removeRegistration(registration: Registration) {
    if (!window.confirm("Delete this project registration? This cannot be undone.")) return;
    startTransition(async () => {
      try {
        await deleteRegistrationAction(registration.id, registration.projectId);
        show("Registration deleted.");
      } catch (error) {
        show(error instanceof Error ? error.message : "Could not delete registration.", false);
      }
    });
  }

  return (
    <div className="admin-table-wrap">
      <table className="admin-table registration-table">
        <thead><tr><th>Member</th><th>Contact</th><th>Registration responses</th><th>Registered</th><th>Actions</th></tr></thead>
        <tbody>{registrations.map((registration) => {
          const email = registration.member?.email || String(responseEntries(registration.data).find(([key]) => key.toLowerCase() === "email")?.[1] || "—");
          return <tr key={registration.id}><td><strong>{registration.member?.fullName || "Guest applicant"}</strong><span className="table-subtext">{registration.member?.programme || "No programme provided"}</span></td><td>{email}</td><td><div className="response-list">{responseEntries(registration.data).map(([key, value]) => <span key={key}><b>{key}:</b> {String(value)}</span>)}</div></td><td>{new Date(registration.createdAt).toLocaleDateString()}</td><td><button className="icon-btn danger" type="button" disabled={isPending} onClick={() => removeRegistration(registration)}>Delete</button></td></tr>;
        })}</tbody>
      </table>
      {registrations.length === 0 && <div className="admin-empty-state">No one has registered for this project yet.</div>}
    </div>
  );
}