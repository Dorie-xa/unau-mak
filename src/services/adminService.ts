import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function verifyAdminLogin(email: string, password: string) {
  const admin = await prisma.admin.findUnique({ where: { email } });
  if (!admin) return null;
  const ok = await bcrypt.compare(password, admin.passwordHash);
  if (!ok) return null;
  return { adminId: admin.id, email: admin.email, name: admin.name };
}
