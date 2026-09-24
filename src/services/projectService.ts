import { prisma } from "@/lib/prisma";
import { FieldType, ProjectStatus } from "@prisma/client";

export async function listProjects() {
  return prisma.project.findMany({
    orderBy: { createdAt: "asc" },
    include: { _count: { select: { registrations: true } } },
  });
}

export async function getProjectBySlug(slug: string) {
  return prisma.project.findUnique({
    where: { slug },
    include: { fields: { orderBy: { position: "asc" } } },
  });
}

export async function getProjectById(id: string) {
  return prisma.project.findUnique({
    where: { id },
    include: { fields: { orderBy: { position: "asc" } }, _count: { select: { registrations: true } } },
  });
}

function slugify(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export type FieldInput = {
  label: string;
  type: FieldType;
  required: boolean;
  options?: string[];
};

export async function createProject(input: {
  name: string;
  description: string;
  status: ProjectStatus;
  bannerUrl?: string;
  fields: FieldInput[];
}) {
  let slug = slugify(input.name);
  const clash = await prisma.project.findUnique({ where: { slug } });
  if (clash) slug = `${slug}-${Date.now().toString(36)}`;

  return prisma.project.create({
    data: {
      slug,
      name: input.name,
      description: input.description,
      status: input.status,
      bannerUrl: input.bannerUrl,
      fields: {
        create: input.fields.map((f, i) => ({
          label: f.label,
          type: f.type,
          required: f.required,
          options: f.options ?? [],
          position: i,
        })),
      },
    },
  });
}

export async function updateProject(
  id: string,
  input: { name: string; description: string; status: ProjectStatus; bannerUrl?: string }
) {
  return prisma.project.update({
    where: { id },
    data: {
      name: input.name,
      description: input.description,
      status: input.status,
      ...(input.bannerUrl ? { bannerUrl: input.bannerUrl } : {}),
    },
  });
}

export async function deleteProject(id: string) {
  return prisma.project.delete({ where: { id } });
}

export async function registerForProject(slug: string, data: Record<string, string>, memberEmail?: string) {
  const project = await prisma.project.findUnique({ where: { slug } });
  if (!project) throw new Error("Project not found");

  const submittedEmail = Object.entries(data).find(([key]) => key.trim().toLowerCase() === "email")?.[1];
  const email = (memberEmail || submittedEmail || "").trim().toLowerCase();
  let memberId: string | undefined;
  if (email) {
    const member = await prisma.member.findUnique({ where: { email } });
    if (member) memberId = member.id;
  }

  return prisma.projectRegistration.create({
    data: { projectId: project.id, memberId, data },
  });
}

export async function listRegistrations(projectId: string) {
  const registrations = await prisma.projectRegistration.findMany({
    where: { projectId },
    orderBy: { createdAt: "desc" },
    include: { member: true },
  });

  const unlinkedEmails = registrations
    .filter((registration) => !registration.member)
    .map((registration) => {
      const data = registration.data as Record<string, unknown>;
      return Object.entries(data).find(([key]) => key.trim().toLowerCase() === "email")?.[1];
    })
    .filter((email): email is string => typeof email === "string" && email.trim().length > 0)
    .map((email) => email.trim().toLowerCase());

  if (unlinkedEmails.length === 0) return registrations;

  const members = await prisma.member.findMany({ where: { email: { in: unlinkedEmails } } });
  const membersByEmail = new Map(members.map((member) => [member.email.toLowerCase(), member]));

  return registrations.map((registration) => {
    if (registration.member) return registration;
    const data = registration.data as Record<string, unknown>;
    const email = Object.entries(data).find(([key]) => key.trim().toLowerCase() === "email")?.[1];
    const member = typeof email === "string" ? membersByEmail.get(email.trim().toLowerCase()) : undefined;
    return member ? { ...registration, member } : registration;
  });
}

export async function deleteRegistration(id: string) {
  return prisma.projectRegistration.delete({ where: { id } });
}
