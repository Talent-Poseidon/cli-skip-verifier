import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(projects);
  } catch (error) {
    console.error("[API] GET /api/projects failed:", error);
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, startDate, endDate } = body;

    if (!name || !startDate || !endDate) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (end < start) {
      return NextResponse.json({ error: "End date must be after start date" }, { status: 400 });
    }

    const project = await prisma.project.create({
      data: {
        name,
        startDate: start,
        endDate: end,
      },
    });
    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error("[API] POST /api/projects failed:", error);
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
  }
}
