import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export type SignupInput = {
  fullName: string;
  studentNumber?: string;
  email: string;
  programme?: string;
  yearOfStudy?: string;
  password: string;
  sdgs: number[];
};

export async function signupMember(input: SignupInput) {
  if (input.sdgs.length < 3 || input.sdgs.length > 5) {
    throw new Error("Please select between 3 and 5 SDGs.");
  }
  const existing = await prisma.member.findUnique({ where: { email: input.email } });
  if (existing) {
    throw new Error("An account with this email already exists.");
  }
  const passwordHash = await bcrypt.hash(input.password, 10);
  return prisma.member.create({
    data: {
      fullName: input.fullName,
      studentNumber: input.studentNumber,
      email: input.email,
      programme: input.programme,
      yearOfStudy: input.yearOfStudy,
      passwordHash,
      sdgs: input.sdgs,
    },
  });
}

export async function listMembers() {
  return prisma.member.findMany({ orderBy: { createdAt: "desc" } });
}

export async function updateMember(
  id: string,
  input: { fullName: string; email: string; programme?: string; yearOfStudy?: string; sdgs: number[] }
) {
  const existing = await prisma.member.findFirst({ where: { email: input.email, NOT: { id } } });
  if (existing) throw new Error("Another member already uses that email.");

  return prisma.member.update({
    where: { id },
    data: {
      fullName: input.fullName,
      email: input.email,
      programme: input.programme || null,
      yearOfStudy: input.yearOfStudy || null,
      sdgs: input.sdgs,
    },
  });
}

export async function deleteMember(id: string) {
  return prisma.member.delete({ where: { id } });
}

export async function memberStats() {
  const total = await prisma.member.count();
  const members = await prisma.member.findMany({ select: { sdgs: true } });
  const counts: Record<number, number> = {};
  for (const m of members) for (const s of m.sdgs) counts[s] = (counts[s] || 0) + 1;
  let topSdg: number | null = null;
  let topCount = 0;
  for (const [sdg, count] of Object.entries(counts)) {
    if (count > topCount) {
      topCount = count;
      topSdg = Number(sdg);
    }
  }
  return { total, topSdg };
}
