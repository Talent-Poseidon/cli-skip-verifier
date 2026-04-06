import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const dictionaries = await prisma.competencyDictionary.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(dictionaries);
  } catch (error) {
    console.error("[API] GET /api/competency-dictionary failed:", error);
    return NextResponse.json({ error: "Failed to fetch competency dictionaries" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, fileName, fileUrl } = body;

    if (!name || !fileName || !fileUrl) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const dictionary = await prisma.competencyDictionary.create({
      data: { name, fileName, fileUrl },
    });
    return NextResponse.json(dictionary, { status: 201 });
  } catch (error) {
    console.error("[API] POST /api/competency-dictionary failed:", error);
    return NextResponse.json({ error: "Failed to create competency dictionary" }, { status: 500 });
  }
}
