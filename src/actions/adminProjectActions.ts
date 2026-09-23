"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth";
import { createProject, updateProject, deleteProject, type FieldInput } from "@/services/projectService";
import { FieldType, ProjectStatus } from "@prisma/client";

async function requireAdmin() {
  const session = await getAdminSession();
  if (!session) throw new Error("Not authorized");
}

function parseFields(formData: FormData): FieldInput[] {
  const labels = formData.getAll("fieldLabel").map(String);
  const types = formData.getAll("fieldType").map(String) as FieldType[];
  const requireds = formData.getAll("fieldRequired").map(String);
  const optionsRaw = formData.getAll("fieldOptions").map(String);

  return labels
    .map((label, i) => ({
      label,
      type: (types[i] as FieldType) || "TEXT",
      required: requireds[i] === "true",
      options: optionsRaw[i]
        ? optionsRaw[i].split(",").map((o) => o.trim()).filter(Boolean)
        : [],
    }))
    .filter((f) => f.label.trim().length > 0);
}

export async function createProjectAction(formData: FormData) {
  await requireAdmin();
  const fields = parseFields(formData);
  await createProject({
    name: String(formData.get("name") || ""),
    description: String(formData.get("description") || ""),
    status: (String(formData.get("status") || "COMING_SOON") as ProjectStatus),
    bannerUrl: String(formData.get("bannerUrl") || "") || undefined,
    fields,
  });
  revalidatePath("/admin/projects");
  revalidatePath("/projects");
  redirect("/admin/projects");
}

export async function updateProjectAction(id: string, formData: FormData) {
  await requireAdmin();
  await updateProject(id, {
    name: String(formData.get("name") || ""),
    description: String(formData.get("description") || ""),
    status: (String(formData.get("status") || "COMING_SOON") as ProjectStatus),
    bannerUrl: String(formData.get("bannerUrl") || "") || undefined,
  });
  revalidatePath("/admin/projects");
  revalidatePath("/projects");
}

export async function deleteProjectAction(id: string) {
  await requireAdmin();
  await deleteProject(id);
  revalidatePath("/admin/projects");
  revalidatePath("/projects");
}
