import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuth, ApiContext } from "@/lib/api-utils";
import { timeLogSchema } from "@/lib/validators";
import { startOfDay, endOfDay } from "date-fns";
import { ZodError } from "zod";

/**
 * PATCH /api/time-logs/[id]
 * Update a time log
 */
export const PATCH = withAuth(async (req, user, context: ApiContext) => {
  const { id } = await context.params;

  try {
    const existingLog = await prisma.timeLog.findUnique({
      where: { id },
    });

    if (!existingLog) {
      return NextResponse.json(
        { error: "Time log not found" },
        { status: 404 },
      );
    }

    // Permission check: Admins can update any, Employees only their own
    if (user.role === "EMPLOYEE" && existingLog.userId !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    // Allow partial updates
    const validatedData = timeLogSchema.partial().parse(body);

    // If updating hours or date, re-validate the 12h limit
    if (validatedData.hours || validatedData.logDate) {
      const logDate = validatedData.logDate
        ? new Date(validatedData.logDate)
        : existingLog.logDate;
      const hours =
        validatedData.hours !== undefined
          ? validatedData.hours
          : existingLog.hours;

      const dayStart = startOfDay(logDate);
      const dayEnd = endOfDay(logDate);

      const [dayLogs] = await Promise.all([
        prisma.timeLog.findMany({
          where: {
            userId: existingLog.userId,
            logDate: {
              gte: dayStart,
              lte: dayEnd,
            },
            id: { not: id }, // Exclude current log
          },
        }),
      ]);

      const totalOtherHours = dayLogs.reduce((acc, log) => acc + log.hours, 0);
      if (totalOtherHours + hours > 12) {
        return NextResponse.json(
          {
            error: `Daily limit exceeded. You can only log up to 12 hours per day. You have ${
              12 - totalOtherHours
            } hours remaining for ${logDate.toLocaleDateString()}.`,
          },
          { status: 400 },
        );
      }
    }

    const updatedLog = await prisma.timeLog.update({
      where: { id },
      data: validatedData,
    });

    return NextResponse.json(updatedLog);
  } catch (error) {
    console.error("PATCH Time Log Error:", error);
    if (error instanceof ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Failed to update time log" },
      { status: 500 },
    );
  }
}, "timelog:update:own");

/**
 * DELETE /api/time-logs/[id]
 * Delete a time log
 */
export const DELETE = withAuth(async (req, user, context: ApiContext) => {
  const { id } = await context.params;

  try {
    const existingLog = await prisma.timeLog.findUnique({
      where: { id },
    });

    if (!existingLog) {
      return NextResponse.json(
        { error: "Time log not found" },
        { status: 404 },
      );
    }

    // Permission check
    if (user.role === "EMPLOYEE" && existingLog.userId !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await prisma.timeLog.delete({
      where: { id },
    });

    return new Response(null, { status: 204 });
  } catch (error) {
    console.error("DELETE Time Log Error:", error);
    return NextResponse.json(
      { error: "Failed to delete time log" },
      { status: 500 },
    );
  }
}, "timelog:delete:own");
