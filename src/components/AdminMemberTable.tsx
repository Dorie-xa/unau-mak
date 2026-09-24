"use client";

import { useState, useTransition } from "react";
import { useToast } from "@/components/Toast";
import { deleteMemberAction, updateMemberAction } from "@/actions/adminMemberActions";

type Member = {
  id: string;
  fullName: string;
  email: string;
  programme: string | null;
  yearOfStudy: string | null;
  sdgs: number[];
  createdAt: Date;
};

export default function AdminMemberTable({ members }: { members: Member[] }) {
  const { show } = useToast();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function updateMember(id: string, formData: FormData) {
    startTransition(async () => {
      try {
        await updateMemberAction(id, formData);
        setEditingId(null);
        show("Member details updated.");
      } catch (error) {
        show(error instanceof Error ? error.message : "Could not update member.", false);
      }
    });
  }

  function removeMember(id: string, name: string) {
    if (!window.confirm(`Delete ${name}'s member account? This cannot be undone.`)) return;
    startTransition(async () => {
      try {
        await deleteMemberAction(id);
        show("Member deleted.");
      } catch (error) {
        show(error instanceof Error ? error.message : "Could not delete member.", false);
      }
    });
  }

  return (
    <div className="admin-table-wrap">
      <table className="admin-table admin-member-table">
        <thead><tr><th>Member</th><th>Email</th><th>Programme</th><th>Year</th><th>SDGs</th><th>Joined</th><th>Actions</th></tr></thead>
        <tbody>
          {members.map((member) => editingId === member.id ? (
            <tr key={member.id}>
              <td colSpan={7}>
                <form className="admin-member-edit" action={(formData) => updateMember(member.id, formData)}>
                  <div><label>Name</label><input name="fullName" defaultValue={member.fullName} required /></div>
                  <div><label>Email</label><input type="email" name="email" defaultValue={member.email} required /></div>
                  <div><label>Programme</label><input name="programme" defaultValue={member.programme || ""} /></div>
                  <div><label>Year</label><select name="yearOfStudy" defaultValue={member.yearOfStudy || "Year 1"}><option>Year 1</option><option>Year 2</option><option>Year 3</option><option>Year 4+</option></select></div>
                  <div><label>SDGs</label><input name="sdgs" defaultValue={member.sdgs.join(", ")} placeholder="e.g. 1, 4, 13" /></div>
                  <div className="admin-member-edit-actions"><button className="btn secondary" type="submit" disabled={isPending}>Save</button><button className="icon-btn" type="button" onClick={() => setEditingId(null)}>Cancel</button></div>
                </form>
              </td>
            </tr>
          ) : (
            <tr key={member.id}>
              <td><strong>{member.fullName}</strong></td><td>{member.email}</td><td>{member.programme || "—"}</td><td>{member.yearOfStudy || "—"}</td><td>{member.sdgs.length ? member.sdgs.join(", ") : "—"}</td><td>{new Date(member.createdAt).toLocaleDateString()}</td>
              <td><div className="admin-table-actions"><button className="icon-btn" type="button" onClick={() => setEditingId(member.id)}>Edit</button><button className="icon-btn danger" type="button" disabled={isPending} onClick={() => removeMember(member.id, member.fullName)}>Delete</button></div></td>
            </tr>
          ))}
        </tbody>
      </table>
      {members.length === 0 && <div className="admin-empty-state">No members have registered yet.</div>}
    </div>
  );
}