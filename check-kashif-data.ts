import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import * as dotenv from "dotenv";

dotenv.config();

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function checkKashifUser() {
  try {
    const kashif = await prisma.user.findUnique({
      where: { email: "kashifsoh678@gmail.com" },
    });

    if (kashif) {
      console.log("=== KASHIF USER ===");
      console.log(`User ID: ${kashif.id}`);
      console.log(`Role: ${kashif.role}`);

      const projectId = "cmkkew35a000vw5mmgs38oqce";
      const projectLogs = await prisma.timeLog.findMany({
        where: {
          projectId: projectId,
          userId: kashif.id,
        },
        include: {
          project: { select: { name: true } },
        },
      });

      console.log(`\nLogs for project ${projectId}:`, projectLogs.length);

      if (projectLogs.length > 0) {
        projectLogs.forEach((log) => {
          console.log(
            `  - ${log.hours}h on ${log.logDate.toISOString().split("T")[0]} - ${log.notes}`,
          );
        });
      } else {
        console.log("  NO LOGS FOUND for this project!");

        // Check all logs for this user
        const allLogs = await prisma.timeLog.findMany({
          where: { userId: kashif.id },
          include: {
            project: { select: { name: true, id: true } },
          },
        });

        console.log(`\nAll logs for kashif (${allLogs.length} total):`);
        allLogs.forEach((log) => {
          console.log(`  - Project: ${log.project.name} (${log.projectId})`);
          console.log(
            `    ${log.hours}h on ${log.logDate.toISOString().split("T")[0]}`,
          );
        });
      }
    } else {
      console.log("Kashif user not found");
    }
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

checkKashifUser();
