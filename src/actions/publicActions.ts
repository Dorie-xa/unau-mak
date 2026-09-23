"use server";

import { revalidatePath } from "next/cache";
import { signupMember } from "@/services/memberService";
import { registerForProject } from "@/services/projectService";

export type ActionResult = { ok: boolean; message: string };

export async function signupAction(formData: FormData): Promise<ActionResult> {
  try {
    const sdgs = formData.getAll("sdgs").map((v) => Number(v));
    await signupMember({
      fullName: String(formData.get("fullName") || ""),
      studentNumber: String(formData.get("studentNumber") || ""),
      email: String(formData.get("email") || ""),
      programme: String(formData.get("programme") || ""),
      yearOfStudy: String(formData.get("yearOfStudy") || ""),
      password: String(formData.get("password") || ""),
      sdgs,
    });
    return { ok: true, message: "You're signed up! Welcome to the chapter." };
  } catch (e) {
    return { ok: false, message: e instanceof Error ? e.message : "Something went wrong." };
  }
}

export async function registerForProjectAction(slug: string, formData: FormData): Promise<ActionResult> {
  try {
    const data: Record<string, string> = {};
    for (const [key, value] of formData.entries()) {
      if (key === "memberEmail") continue;
      data[key] = String(value);
    }
    const memberEmail = String(formData.get("memberEmail") || "") || undefined;
    await registerForProject(slug, data, memberEmail);
    revalidatePath(`/projects/${slug}`);
    return { ok: true, message: "Registered! A confirmation email is on its way." };
  } catch (e) {
    return { ok: false, message: e instanceof Error ? e.message : "Something went wrong." };
  }
}
