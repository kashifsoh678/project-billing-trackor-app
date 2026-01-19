import {
  PrismaClient,
  TimeLogStatus,
  Project,
  ProjectStatus,
} from "@prisma/client";
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

  // 3. Seed Projects
  console.log("Seeding projects...");
  const baseProjectData = [
    {
      name: "Website Redesign",
      description: "Modernizing the corporate website with Next.js",
      billingRate: 75,
      status: "ACTIVE",
    },
    {
      name: "Mobile App Development",
      description: "Cross-platform mobile app for iOS and Android",
      billingRate: 90,
      status: "ACTIVE",
    },
    {
      name: "Cloud Migration",
      description: "Moving infrastructure to AWS",
      billingRate: 120,
      status: "ACTIVE",
    },
    {
      name: "Database Optimization",
      description: "Improving query performance and indexing",
      billingRate: 85,
      status: "COMPLETED",
    },
    {
      name: "Internal Branding",
      description: "Redesigning office spaces and company culture",
      billingRate: 50,
      status: "ARCHIVED",
    },
    {
      name: "E-commerce Platform",
      description: "Building a headless Shopify integration",
      billingRate: 100,
      status: "ACTIVE",
    },
    {
      name: "Security Audit",
      description: "Phase 1 penetration testing",
      billingRate: 150,
      status: "ACTIVE",
    },
    {
      name: "AI Integration",
      description: "Adding LLM capabilities to customer support",
      billingRate: 110,
      status: "ACTIVE",
    },
    {
      name: "Frontend Library",
      description: "Building a shared UI component library",
      billingRate: 65,
      status: "ACTIVE",
    },
    {
      name: "Legacy Support",
      description: "Maintenance for old PHP servers",
      billingRate: 40,
      status: "ACTIVE",
    },
  ];

  const projects: Project[] = [];
  // Ensure we have exactly 30 projects
  for (let i = 0; i < 30; i++) {
    const base = baseProjectData[i % baseProjectData.length];
    const project = await prisma.project.create({
      data: {
        name:
          i < baseProjectData.length
            ? base.name
            : `${base.name} Phase ${Math.floor(i / baseProjectData.length) + 1}`,
        description: base.description,
        billingRate: base.billingRate + i * 2, // Vary the rate slightly
        status: (i % 5 === 0
          ? "COMPLETED"
          : i % 7 === 0
            ? "ARCHIVED"
            : "ACTIVE") as ProjectStatus,
      },
    });
    projects.push(project);
  }
  console.log(`Created ${projects.length} projects.`);

  // 4. Seed Time Logs (Extensive data for performance testing)
  console.log("Seeding intensive time logs (100+ per project)...");
  const statuses = ["TODO", "IN_PROGRESS", "DONE"];

  for (const proj of projects) {
    const logsToCreate = 110; // Ensure we exceed multiple levels of pagination/load more
    const logs = [];

    for (let i = 0; i < logsToCreate; i++) {
      const date = new Date();
      // Spread logs over last 60 days
      date.setDate(date.getDate() - (i % 60));

      logs.push({
        projectId: proj.id,
        userId: i % 2 === 0 ? admin.id : employee.id,
        hours: Math.floor(Math.random() * 8) + 1,
        notes: `Auto-generated work log entry #${i + 1} for ${proj.name}. Progressing on task module ${Math.floor(i / 10)}.`,
        logDate: date,
        status: statuses[i % statuses.length] as TimeLogStatus,
      });
    }

    // Using createMany for better performance in heavy seeding
    await prisma.timeLog.createMany({
      data: logs,
    });
    console.log(`Created ${logsToCreate} logs for project: ${proj.name}`);
  }

  console.log("Intensive time logs seeding finished.");
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
