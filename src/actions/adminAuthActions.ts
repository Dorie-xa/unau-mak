"use server";

import { redirect } from "next/navigation";
import { changeAdminEmail, changeAdminPassword, verifyAdminLogin } from "@/services/adminService";
import { createAdminSession, clearAdminSession, getAdminSession } from "@/lib/auth";

export async function adminLoginAction(formData: FormData): Promise<{ ok: boolean; message: string }> {
  const email = String(formData.get("email") || "");
  const password = String(formData.get("password") || "");
  const admin = await verifyAdminLogin(email, password);
  if (!admin) {
    return { ok: false, message: "Incorrect email or password." };
  }
  await createAdminSession(admin);
  return { ok: true, message: "Signed in." };
}

export async function adminLogoutAction() {
  clearAdminSession();
  redirect("/");
}

export async function changeAdminPasswordAction(formData: FormData): Promise<{ ok: boolean; message: string }> {
  const session = await getAdminSession();
  if (!session) return { ok: false, message: "Your session has expired. Please sign in again." };

  const currentPassword = String(formData.get("currentPassword") || "");
  const newPassword = String(formData.get("newPassword") || "");
  const confirmPassword = String(formData.get("confirmPassword") || "");

  if (newPassword.length < 8) return { ok: false, message: "New password must be at least 8 characters." };
  if (newPassword !== confirmPassword) return { ok: false, message: "New passwords do not match." };

  return changeAdminPassword(session.adminId, currentPassword, newPassword);
}

export async function changeAdminEmailAction(formData: FormData): Promise<{ ok: boolean; message: string }> {
  const session = await getAdminSession();
  if (!session) return { ok: false, message: "Your session has expired. Please sign in again." };

  const newEmail = String(formData.get("newEmail") || "").trim().toLowerCase();
  const currentPassword = String(formData.get("currentPassword") || "");

  if (!newEmail.includes("@")) return { ok: false, message: "Enter a valid email address." };

  const result = await changeAdminEmail(session.adminId, currentPassword, newEmail);
  if (result.ok) {
    await createAdminSession({ ...session, email: newEmail });
  }
  return result;
}
