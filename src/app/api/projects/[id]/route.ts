import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { projectSchema } from "@/lib/validators";
import { withAuth } from "@/lib/api-utils";

export const GET = withAuth(async (_req, _user, { params }) => {
  try {
    const { id } = await params;

    const project = await prisma.project.findUnique({
      where: { id },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json(project);
  } catch (error) {
    console.error("Project GET Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}, "project:view");

export const PATCH = withAuth(async (req, _user, { params }) => {
  try {
    const { id } = await params;

    const body = await req.json();
    const validation = projectSchema.partial().safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid input", details: validation.error.flatten() },
        { status: 400 },
      );
    }

    const project = await prisma.project.update({
      where: { id },
      data: validation.data,
    });

    return NextResponse.json(project);
  } catch (error) {
    console.error("Project PATCH Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}, "project:update");

export const DELETE = withAuth(async (_req, _user, { params }) => {
  try {
    const { id } = await params;

    const project = await prisma.project.update({
      where: { id },
      data: {
        status: "ARCHIVED",
        archivedAt: new Date(),
      },
    });

    return NextResponse.json(project);
  } catch (error) {
    console.error("Project DELETE Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}, "project:archive");
