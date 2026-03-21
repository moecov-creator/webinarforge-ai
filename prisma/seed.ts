import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const workspace = await prisma.workspace.upsert({
    where: { slug: "demo-workspace" },
    update: {},
    create: {
      name: "Demo Workspace",
      slug: "demo-workspace",
    },
  });

  await prisma.webinar.createMany({
    data: [
      {
        workspaceId: workspace.id,
        title: "High-Ticket Coaching Funnel",
        status: "PUBLISHED",
        registrations: 128,
        clicks: 19,
      },
      {
        workspaceId: workspace.id,
        title: "Real Estate Lead Machine",
        status: "PUBLISHED",
        registrations: 94,
        clicks: 14,
      },
      {
        workspaceId: workspace.id,
        title: "SaaS Demo Webinar",
        status: "DRAFT",
        registrations: 0,
        clicks: 0,
      },
    ],
    skipDuplicates: true,
  });

  console.log("🌱 Seeded!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
