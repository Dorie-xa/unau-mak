"use server";

import { revalidatePath } from "next/cache";
import { getAdminSession } from "@/lib/auth";
import { deleteMember, updateMember } from "@/services/memberService";

async function requireAdmin() {
  const session = await getAdminSession();
  if (!session) throw new Error("Not authorized");
}

function parseSdgs(value: string) {
  return value
    .split(",")
    .map((item) => Number(item.trim()))
    .filter((item) => Number.isInteger(item) && item >= 1 && item <= 17);
}

export async function updateMemberAction(id: string, formData: FormData) {
  await requireAdmin();
  const fullName = String(formData.get("fullName") || "").trim();
  const email = String(formData.get("email") || "").trim().toLowerCase();
  if (!fullName || !email || !email.includes("@")) throw new Error("Name and a valid email are required.");

  await updateMember(id, {
    fullName,
    email,
    programme: String(formData.get("programme") || "").trim(),
    yearOfStudy: String(formData.get("yearOfStudy") || "").trim(),
    sdgs: parseSdgs(String(formData.get("sdgs") || "")),
  });
  revalidatePath("/admin/members");
  revalidatePath("/admin");
}

export async function deleteMemberAction(id: string) {
  await requireAdmin();
  await deleteMember(id);
  revalidatePath("/admin/members");
  revalidatePath("/admin");
}