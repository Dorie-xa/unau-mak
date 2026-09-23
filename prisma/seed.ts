import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // --- Two admin accounts ---
  const admins = [
    {
      email: process.env.ADMIN1_EMAIL || "patricia@unaumak.org",
      password: process.env.ADMIN1_PASSWORD || "ChangeMe123!",
      name: process.env.ADMIN1_NAME || "Patricia N.",
    },
    {
      email: process.env.ADMIN2_EMAIL || "david@unaumak.org",
      password: process.env.ADMIN2_PASSWORD || "ChangeMe123!",
      name: process.env.ADMIN2_NAME || "David K.",
    },
  ];

  for (const a of admins) {
    const passwordHash = await bcrypt.hash(a.password, 10);
    await prisma.admin.upsert({
      where: { email: a.email },
      update: {},
      create: { email: a.email, passwordHash, name: a.name },
    });
  }

  // --- Chapter welcome message (footer) ---
  const existingSettings = await prisma.chapterSettings.findFirst();
  if (!existingSettings) {
    await prisma.chapterSettings.create({
      data: {
        welcomeMessage:
          "Welcome to the Makerere University Chapter of the United Nations Association of Uganda. Whatever brought you here — curiosity about the SDGs, a love of debate, or a wish to serve — there is a place for you in this community. Sign up, pick the goals you care about, and join us in turning global ideas into local action.",
      },
    });
  }

  // --- Footer contact links ---
  const linkCount = await prisma.footerLink.count();
  if (linkCount === 0) {
    await prisma.footerLink.createMany({
      data: [
        { label: "Email", value: "unau.mak@example.org", position: 0 },
        { label: "Location", value: "Makerere University, Kampala", position: 1 },
        { label: "Instagram / X", value: "@unau_mak", position: 2 },
      ],
    });
  }

  // --- Homepage highlight cards ---
  const cardCount = await prisma.homeCard.count();
  if (cardCount === 0) {
    await prisma.homeCard.createMany({
      data: [
        {
          icon: "🌍",
          title: "Pick your SDGs",
          description: "Choose the goals you're passionate about when you sign up, so we can match you to the right projects.",
          position: 0,
        },
        {
          icon: "🗳️",
          title: "Model United Nations",
          description: "Our flagship chapter project — debate global issues as a country delegate.",
          position: 1,
        },
        {
          icon: "🤝",
          title: "Volunteer & lead",
          description: "Register for chapter projects and grow into committee and leadership roles.",
          position: 2,
        },
      ],
    });
  }

  // --- MUN project with its registration form ---
  const mun = await prisma.project.upsert({
    where: { slug: "mun" },
    update: {},
    create: {
      slug: "mun",
      name: "Model United Nations",
      description:
        "A simulation of how the real United Nations works. Delegates represent a country, research its real foreign policy, and negotiate, debate and vote on resolutions to global problems — from peacekeeping to climate change — using the UN's own rules of procedure.",
      status: "OPEN",
      infoLinks: [
        { label: "What is Model UN? — explainer videos", url: "https://www.youtube.com/results?search_query=what+is+model+united+nations+explained" },
        { label: "Delegate tips & rules of procedure", url: "https://www.youtube.com/results?search_query=model+united+nations+best+delegate+tips" },
        { label: "Upcoming MUN conferences in Uganda", url: "https://mymun.com/conferences/uganda" },
        { label: "Official United Nations site", url: "https://www.un.org/en" },
      ],
    },
  });

  const fieldCount = await prisma.registrationField.count({ where: { projectId: mun.id } });
  if (fieldCount === 0) {
    await prisma.registrationField.createMany({
      data: [
        { projectId: mun.id, label: "Full name", type: "TEXT", required: true, position: 0 },
        { projectId: mun.id, label: "Email", type: "EMAIL", required: true, position: 1 },
        {
          projectId: mun.id,
          label: "Preferred committee",
          type: "SELECT",
          required: true,
          options: ["General Assembly", "Security Council", "UNESCO", "ECOSOC", "No preference"],
          position: 2,
        },
        { projectId: mun.id, label: "Country preference (optional)", type: "TEXT", required: false, position: 3 },
        {
          projectId: mun.id,
          label: "MUN experience level",
          type: "SELECT",
          required: true,
          options: ["First-timer", "Some experience", "Experienced delegate"],
          position: 4,
        },
      ],
    });
  }

  console.log("Seed complete. Admin logins:");
  admins.forEach((a) => console.log(`  ${a.email} / ${a.password}`));
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
