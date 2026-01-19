import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuth, ApiContext } from "@/lib/api-utils";
import { format } from "date-fns";

/**
 * GET /api/projects/[id]/billing-summary
 * Get billing summary for a specific project
 */
export const GET = withAuth(async (_req, user, context: ApiContext) => {
  const { id } = await context.params;

  try {
    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        timeLogs: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const totalHours = project.timeLogs.reduce(
      (acc, log) => acc + log.hours,
      0,
    );
    const totalAmount = totalHours * project.billingRate;

    // Group by User
    const userMap = new Map();

    project.timeLogs.forEach((log) => {
      const userId = log.user.id;
      if (!userMap.has(userId)) {
        userMap.set(userId, {
          userId: log.user.id,
          userName: log.user.name,
          userEmail: log.user.email,
          hours: 0,
          amount: 0,
        });
      }
      const userData = userMap.get(userId);
      userData.hours += log.hours;
      userData.amount += log.hours * project.billingRate;
    });

    // Group by Date
    const dateMap = new Map();
    project.timeLogs.forEach((log) => {
      const dateStr = format(log.logDate, "yyyy-MM-dd");
      if (!dateMap.has(dateStr)) {
        dateMap.set(dateStr, {
          date: dateStr,
          hours: 0,
          amount: 0,
        });
      }
      const dateData = dateMap.get(dateStr);
      dateData.hours += log.hours;
      dateData.amount += log.hours * project.billingRate;
    });

    const summary = {
      totalHours,
      totalAmount,
      hoursByUser: Array.from(userMap.values()),
      hoursByDate: Array.from(dateMap.values()).sort((a, b) =>
        b.date.localeCompare(a.date),
      ),
    };

    return NextResponse.json(summary);
  } catch (error) {
    console.error("GET Billing Summary Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch billing summary" },
      { status: 500 },
    );
  }
}, "billing:view");
