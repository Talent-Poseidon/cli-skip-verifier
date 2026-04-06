import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const scenarios = await prisma.scenario.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(scenarios);
  } catch (error) {
    console.error("[API] GET /api/scenarios failed:", error);
    return NextResponse.json({ error: "Failed to fetch scenarios" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description } = body;

    if (!name) {
      return NextResponse.json({ error: "Scenario name is required" }, { status: 400 });
    }

    const scenario = await prisma.scenario.create({
      data: { name, description: description || null },
    });
    return NextResponse.json(scenario, { status: 201 });
  } catch (error) {
    console.error("[API] POST /api/scenarios failed:", error);
    return NextResponse.json({ error: "Failed to create scenario" }, { status: 500 });
  }
}
