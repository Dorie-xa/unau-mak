"use server";

import { redirect } from "next/navigation";
import { verifyAdminLogin } from "@/services/adminService";
import { createAdminSession, clearAdminSession } from "@/lib/auth";

export async function adminLoginAction(formData: FormData): Promise<{ ok: boolean; message: string }> {
  const email = String(formData.get("email") || "");
  const password = String(formData.get("password") || "");
  const admin = await verifyAdminLogin(email, password);
  if (!admin) {
    return { ok: false, message: "Incorrect email or password." };
  }
  await createAdminSession(admin);
  redirect("/admin");
}

export async function adminLogoutAction() {
  clearAdminSession();
  redirect("/admin/login");
}
