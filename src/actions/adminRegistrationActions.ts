"use server";

import { revalidatePath } from "next/cache";
import { getAdminSession } from "@/lib/auth";
import { deleteRegistration } from "@/services/projectService";

export async function deleteRegistrationAction(id: string, projectId: string) {
  const session = await getAdminSession();
  if (!session) throw new Error("Not authorized");

  await deleteRegistration(id);
  revalidatePath(`/admin/registrations/${projectId}`);
  revalidatePath("/admin/registrations");
  revalidatePath("/admin");
}