import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { projectSchema } from "@/lib/validators";
import { withAuth } from "@/lib/api-utils";

export const GET = withAuth(async (req) => {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    const skip = (page - 1) * limit;

    const where: import("@prisma/client").Prisma.ProjectWhereInput = {};

    if (status && status !== "ALL") {
      where.status = status as import("@prisma/client").ProjectStatus;
    } else if (!status) {
      where.archivedAt = null; // Default view: non-archived
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    const [projects, total] = await Promise.all([
      prisma.project.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.project.count({ where }),
    ]);

    return NextResponse.json({
      data: projects,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Projects GET Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}, "project:view");

export const POST = withAuth(async (req) => {
  try {
    const body = await req.json();
    const validation = projectSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid input", details: validation.error.flatten() },
        { status: 400 },
      );
    }

    const project = await prisma.project.create({
      data: validation.data,
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error("Project POST Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}, "project:create");
