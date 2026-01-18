import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuth } from "@/lib/api-utils";
import { timeLogSchema } from "@/lib/validators";
import { startOfDay, endOfDay } from "date-fns";
import { Prisma } from "@prisma/client";
import { ZodError } from "zod";

import { TimeLogStatus } from "@/types/enums";

/**
 * GET /api/time-logs
 * List time logs with filters
 */
export const GET = withAuth(async (req, user) => {
  const { searchParams } = new URL(req.url);
  const projectId = searchParams.get("projectId");
  const userId = searchParams.get("userId");
  const status = searchParams.get("status");

  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "100");
  const skip = (page - 1) * limit;

  const where: Prisma.TimeLogWhereInput = {};
  if (projectId) where.projectId = projectId;
  if (userId) where.userId = userId;
  if (status) where.status = status as TimeLogStatus;

  // Employees can only see their own logs
  if (user.role === "EMPLOYEE") {
    where.userId = user.id;
  }

  try {
    const [timeLogs, total] = await Promise.all([
      prisma.timeLog.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          project: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: {
          logDate: "desc",
        },
        skip,
        take: limit,
      }),
      prisma.timeLog.count({ where }),
    ]);

    return NextResponse.json({
      data: timeLogs,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("GET Time Logs Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch time logs" },
      { status: 500 },
    );
  }
}, "timelog:view:own");

/**
 * POST /api/time-logs
 * Create a new time log with 12h daily limit validation
 */
export const POST = withAuth(async (req, user) => {
  try {
    const body = await req.json();
    const validatedData = timeLogSchema.parse(body);

    // Ensure the log is for the current user if they are an employee
    const logUserId = validatedData.userId || user.id;
    if (user.role === "EMPLOYEE" && logUserId !== user.id) {
      return NextResponse.json(
        { error: "You can only log time for yourself" },
        { status: 403 },
      );
    }

    const logDate = new Date(validatedData.logDate);
    const dayStart = startOfDay(logDate);
    const dayEnd = endOfDay(logDate);

    // Check existing hours for this user on this day
    const existingLogs = await prisma.timeLog.findMany({
      where: {
        userId: logUserId,
        logDate: {
          gte: dayStart,
          lte: dayEnd,
        },
      },
    });

    const totalExistingHours = existingLogs.reduce(
      (acc, log) => acc + log.hours,
      0,
    );
    const newTotalHours = totalExistingHours + validatedData.hours;

    if (newTotalHours > 12) {
      return NextResponse.json(
        {
          error: `Daily limit exceeded. You can only log up to 12 hours per day. You have ${
            12 - totalExistingHours
          } hours remaining for ${logDate.toLocaleDateString()}.`,
        },
        { status: 400 },
      );
    }

    const timeLog = await prisma.timeLog.create({
      data: {
        ...validatedData,
        userId: logUserId,
        logDate: logDate,
      },
    });

    return NextResponse.json(timeLog, { status: 201 });
  } catch (error) {
    console.error("POST Time Log Error:", error);
    if (error instanceof ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Failed to create time log" },
      { status: 500 },
    );
  }
}, "timelog:create");
