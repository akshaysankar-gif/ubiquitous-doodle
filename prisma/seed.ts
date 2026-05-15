import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("changeme123", 10);

  await prisma.user.upsert({
    where: { email: "akshay.sankar@surveysparrow.com" },
    update: {},
    create: {
      email: "akshay.sankar@surveysparrow.com",
      passwordHash,
      name: "Admin",
      role: "ADMIN",
    },
  });

  console.log("Seed complete: Admin user created.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
