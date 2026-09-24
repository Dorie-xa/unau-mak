"use server";

import { clearMemberSession, createMemberSession } from "@/lib/auth";
import { verifyMemberLogin } from "@/services/memberService";

export async function memberLoginAction(formData: FormData): Promise<{ ok: boolean; message: string }> {
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");
  const member = await verifyMemberLogin(email, password);

  if (!member) return { ok: false, message: "Incorrect email or password." };

  await createMemberSession(member);
  return { ok: true, message: "Signed in." };
}

export async function memberLogoutAction(): Promise<{ ok: boolean }> {
  clearMemberSession();
  return { ok: true };
}