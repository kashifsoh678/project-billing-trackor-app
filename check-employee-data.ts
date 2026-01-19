import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import * as dotenv from "dotenv";

dotenv.config();

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function checkEmployeeData() {
  try {
    // Get all users
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        role: true,
        _count: {
          select: {
            timeLogs: true,
          },
        },
      },
    });

    console.log("=== USERS ===");
    users.forEach((user) => {
      console.log(
        `${user.email} (${user.role}): ${user._count.timeLogs} time logs`,
      );
      console.log(`  User ID: ${user.id}`);
    });

    // Get employee specifically
    const employee = await prisma.user.findUnique({
      where: { email: "employee@billingtrack.com" },
    });

    if (employee) {
      console.log("\n=== EMPLOYEE TIME LOGS ===");
      const employeeLogs = await prisma.timeLog.findMany({
        where: { userId: employee.id },
        take: 5,
        include: {
          project: {
            select: { name: true },
          },
        },
      });

      console.log(`Found ${employeeLogs.length} logs (showing first 5):`);
      employeeLogs.forEach((log) => {
        console.log(
          `  - ${log.project.name}: ${log.hours}h on ${log.logDate.toISOString().split("T")[0]}`,
        );
      });

      // Check specific project
      const projectId = "cmkkew35a000vw5mmgs38oqce";
      const projectLogs = await prisma.timeLog.findMany({
        where: {
          projectId: projectId,
          userId: employee.id,
        },
      });

      console.log(`\n=== PROJECT ${projectId} ===`);
      console.log(`Employee has ${projectLogs.length} logs for this project`);
    }
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

checkEmployeeData();
