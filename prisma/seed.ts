import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcrypt";
import * as dotenv from "dotenv";

dotenv.config();

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding database...");

  const adminEmail = process.env.ADMIN_EMAIL || "admin@billingtrack.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "Admin@123";

  const hashedAdminPassword = await bcrypt.hash(adminPassword, 10);

  // 1. Seed Admin
  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      password: hashedAdminPassword,
      role: "ADMIN",
    },
    create: {
      email: adminEmail,
      name: "System Admin",
      password: hashedAdminPassword,
      role: "ADMIN",
    },
  });

  console.log(`Admin user created: ${admin.email}`);

  // 2. Seed Employee
  const employeeEmail = "employee@billingtrack.com";
  const employeePassword = "Employee@123";
  const hashedEmployeePassword = await bcrypt.hash(employeePassword, 10);

  const employee = await prisma.user.upsert({
    where: { email: employeeEmail },
    update: {
      password: hashedEmployeePassword,
      role: "EMPLOYEE",
    },
    create: {
      email: employeeEmail,
      name: "John Employee",
      password: hashedEmployeePassword,
      role: "EMPLOYEE",
    },
  });

  console.log(`Employee user created: ${employee.email}`);

  console.log("Seeding finished.");
}

main()
  .catch((e) => {
    console.error("Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
