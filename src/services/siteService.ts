import { prisma } from "@/lib/prisma";

// --- Home highlight cards ---
export async function listHomeCards() {
  return prisma.homeCard.findMany({ orderBy: { position: "asc" } });
}

export async function createHomeCard(input: { icon?: string; imageUrl?: string; title: string; description: string }) {
  const count = await prisma.homeCard.count();
  return prisma.homeCard.create({ data: { ...input, position: count } });
}

export async function updateHomeCard(
  id: string,
  input: { icon?: string; imageUrl?: string; title: string; description: string }
) {
  return prisma.homeCard.update({ where: { id }, data: input });
}

export async function deleteHomeCard(id: string) {
  return prisma.homeCard.delete({ where: { id } });
}

// --- Footer contact links ---
export async function listFooterLinks() {
  return prisma.footerLink.findMany({ orderBy: { position: "asc" } });
}

export async function createFooterLink(input: { label: string; value: string }) {
  const count = await prisma.footerLink.count();
  return prisma.footerLink.create({ data: { ...input, position: count } });
}

export async function updateFooterLink(id: string, input: { label: string; value: string }) {
  return prisma.footerLink.update({ where: { id }, data: input });
}

export async function deleteFooterLink(id: string) {
  return prisma.footerLink.delete({ where: { id } });
}

// --- Welcome message shown in the footer ---
export async function getWelcomeMessage() {
  const settings = await prisma.chapterSettings.findFirst();
  return (
    settings?.welcomeMessage ??
    "Welcome to the Makerere University Chapter of the United Nations Association of Uganda."
  );
}

export async function updateWelcomeMessage(message: string) {
  const settings = await prisma.chapterSettings.findFirst();
  if (settings) {
    return prisma.chapterSettings.update({ where: { id: settings.id }, data: { welcomeMessage: message } });
  }
  return prisma.chapterSettings.create({ data: { welcomeMessage: message } });
}
