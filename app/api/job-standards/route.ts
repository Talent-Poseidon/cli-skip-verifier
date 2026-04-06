import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const standards = await prisma.jobStandard.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(standards);
  } catch (error) {
    console.error("[API] GET /api/job-standards failed:", error);
    return NextResponse.json({ error: "Failed to fetch job standards" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { jobTitle, scoreExpectation } = body;

    if (!jobTitle || scoreExpectation === undefined || scoreExpectation === null) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const score = Number(scoreExpectation);
    if (isNaN(score)) {
      return NextResponse.json({ error: "Score expectation must be a number" }, { status: 400 });
    }

    const standard = await prisma.jobStandard.create({
      data: { jobTitle, scoreExpectation: score },
    });
    return NextResponse.json(standard, { status: 201 });
  } catch (error) {
    console.error("[API] POST /api/job-standards failed:", error);
    return NextResponse.json({ error: "Failed to create job standard" }, { status: 500 });
  }
}
