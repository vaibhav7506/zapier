import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // Clear existing data to avoid unique constraint errors
  await prisma.availableTrigger.deleteMany();
  await prisma.availableAction.deleteMany();

  // Seed Available Triggers
  await prisma.availableTrigger.createMany({
    data: [
      {
        id: "webhook",
        name: "Webhook",
        image: "https://static-00.iconduck.com/assets.00/webhook-icon-512x488-76v98s9z.png",
      },
      {
        id: "solana",
        name: "Solana",
        image: "https://cryptologos.cc/logos/solana-sol-logo.png",
      },
    ],
  });

  // Seed Available Actions
  await prisma.availableAction.createMany({
    data: [
      {
        id: "email",
        name: "Email",
        image: "https://static-00.iconduck.com/assets.00/email-icon-512x512-v9y8o3v1.png",
      },
      {
        id: "send-sol",
        name: "Send SOL",
        image: "https://cryptologos.cc/logos/solana-sol-logo.png",
      },
    ],
  });

  console.log("✅ Seeding successful: Added Triggers and Actions.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });