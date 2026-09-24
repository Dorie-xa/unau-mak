import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function verifyAdminLogin(email: string, password: string) {
  const admin = await prisma.admin.findUnique({ where: { email } });
  if (!admin) return null;
  const ok = await bcrypt.compare(password, admin.passwordHash);
  if (!ok) return null;
  return { adminId: admin.id, email: admin.email, name: admin.name };
}

export async function changeAdminPassword(adminId: string, currentPassword: string, newPassword: string) {
  const admin = await prisma.admin.findUnique({ where: { id: adminId } });
  if (!admin) return { ok: false, message: "Admin account not found." };

  const currentPasswordMatches = await bcrypt.compare(currentPassword, admin.passwordHash);
  if (!currentPasswordMatches) return { ok: false, message: "Current password is incorrect." };

  const passwordHash = await bcrypt.hash(newPassword, 10);
  await prisma.admin.update({ where: { id: adminId }, data: { passwordHash } });
  return { ok: true, message: "Password updated." };
}

export async function changeAdminEmail(adminId: string, currentPassword: string, newEmail: string) {
  const admin = await prisma.admin.findUnique({ where: { id: adminId } });
  if (!admin) return { ok: false, message: "Admin account not found." };

  const currentPasswordMatches = await bcrypt.compare(currentPassword, admin.passwordHash);
  if (!currentPasswordMatches) return { ok: false, message: "Current password is incorrect." };

  const existingAdmin = await prisma.admin.findUnique({ where: { email: newEmail } });
  if (existingAdmin && existingAdmin.id !== adminId) {
    return { ok: false, message: "That email is already in use." };
  }

  await prisma.admin.update({ where: { id: adminId }, data: { email: newEmail } });
  return { ok: true, message: "Email updated." };
}
