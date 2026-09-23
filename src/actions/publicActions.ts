"use server";

import { revalidatePath } from "next/cache";
import { signupMember } from "@/services/memberService";
import { registerForProject } from "@/services/projectService";
import { getProjectBySlug } from "@/services/projectService";
import { sendConfirmationEmail } from "@/lib/email";

export type ActionResult = { ok: boolean; message: string };

export async function signupAction(formData: FormData): Promise<ActionResult> {
  try {
    const sdgs = formData.getAll("sdgs").map((v) => Number(v));
    const fullName = String(formData.get("fullName") || "");
    const email = String(formData.get("email") || "");
    await signupMember({
      fullName,
      studentNumber: String(formData.get("studentNumber") || ""),
      email,
      programme: String(formData.get("programme") || ""),
      yearOfStudy: String(formData.get("yearOfStudy") || ""),
      password: String(formData.get("password") || ""),
      sdgs,
    });

    await sendConfirmationEmail({
      to: email,
      subject: "Welcome to UNAU — Makerere University Chapter",
      heading: `Welcome, ${fullName}!`,
      bodyLines: [
        "You're officially signed up with the UNAU Makerere University Chapter.",
        "Keep an eye on the Projects page for ways to get involved — starting with Model United Nations.",
      ],
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

    const recipientEmail = data["Email"] || data["email"] || memberEmail;
    if (recipientEmail) {
      const project = await getProjectBySlug(slug);
      await sendConfirmationEmail({
        to: recipientEmail,
        subject: `You're registered for ${project?.name ?? "the project"}`,
        heading: "Registration confirmed",
        bodyLines: [
          `Thanks for registering for <b>${project?.name ?? "this project"}</b> with UNAU Mak Chapter.`,
          "We'll be in touch with next steps closer to the date.",
        ],
      });
    }

    return { ok: true, message: "Registered! A confirmation email is on its way." };
  } catch (e) {
    return { ok: false, message: e instanceof Error ? e.message : "Something went wrong." };
  }
}

