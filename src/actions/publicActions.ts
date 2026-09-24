"use server";

import { revalidatePath } from "next/cache";
import { signupMember } from "@/services/memberService";
import { registerForProject } from "@/services/projectService";
import { getMemberSession } from "@/lib/auth";

export type ActionResult = { ok: boolean; message: string };

export async function signupAction(formData: FormData): Promise<ActionResult> {
  try {
    const sdgs = formData.getAll("sdgs").map((v) => Number(v));
    const fullName = String(formData.get("fullName") || "");
    const email = String(formData.get("email") || "");
    await signupMember({
      fullName,
      email,
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
    const memberSession = await getMemberSession();
    if (!memberSession) return { ok: false, message: "Please sign in as a member first." };

    const data: Record<string, string> = {};
    for (const [key, value] of formData.entries()) {
      if (key === "memberEmail") continue;
      data[key] = String(value);
    }
    await registerForProject(slug, data, memberSession.email);
    revalidatePath(`/projects/${slug}`);

    return { ok: true, message: "Registered" };
  } catch (e) {
    return { ok: false, message: e instanceof Error ? e.message : "Something went wrong." };
  }
}

