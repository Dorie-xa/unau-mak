"use server";

import { revalidatePath } from "next/cache";
import { getAdminSession } from "@/lib/auth";
import {
  createHomeCard,
  updateHomeCard,
  deleteHomeCard,
  createFooterLink,
  updateFooterLink,
  deleteFooterLink,
  updateWelcomeMessage,
} from "@/services/siteService";

async function requireAdmin() {
  const session = await getAdminSession();
  if (!session) throw new Error("Not authorized");
}

export async function createHomeCardAction(formData: FormData) {
  await requireAdmin();
  await createHomeCard({
    icon: String(formData.get("icon") || ""),
    imageUrl: String(formData.get("imageUrl") || "") || undefined,
    title: String(formData.get("title") || ""),
    description: String(formData.get("description") || ""),
  });
  revalidatePath("/admin/home");
  revalidatePath("/");
}

export async function updateHomeCardAction(id: string, formData: FormData) {
  await requireAdmin();
  await updateHomeCard(id, {
    icon: String(formData.get("icon") || ""),
    imageUrl: String(formData.get("imageUrl") || "") || undefined,
    title: String(formData.get("title") || ""),
    description: String(formData.get("description") || ""),
  });
  revalidatePath("/admin/home");
  revalidatePath("/");
}

export async function deleteHomeCardAction(id: string) {
  await requireAdmin();
  await deleteHomeCard(id);
  revalidatePath("/admin/home");
  revalidatePath("/");
}

export async function createFooterLinkAction(formData: FormData) {
  await requireAdmin();
  await createFooterLink({
    label: String(formData.get("label") || ""),
    value: String(formData.get("value") || ""),
  });
  revalidatePath("/admin/home");
  revalidatePath("/");
}

export async function updateFooterLinkAction(id: string, formData: FormData) {
  await requireAdmin();
  await updateFooterLink(id, {
    label: String(formData.get("label") || ""),
    value: String(formData.get("value") || ""),
  });
  revalidatePath("/admin/home");
  revalidatePath("/");
}

export async function deleteFooterLinkAction(id: string) {
  await requireAdmin();
  await deleteFooterLink(id);
  revalidatePath("/admin/home");
  revalidatePath("/");
}

export async function updateWelcomeMessageAction(formData: FormData) {
  await requireAdmin();
  await updateWelcomeMessage(String(formData.get("message") || ""));
  revalidatePath("/admin/home");
  revalidatePath("/");
}
