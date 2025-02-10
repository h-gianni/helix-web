import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const jobGrades = await prisma.jobGrade.findMany({
      orderBy: {
        level: 'asc'
      }
    });

    return Response.json({
      success: true,
      data: jobGrades
    });
  } catch (error) {
    console.error("Error fetching job grades:", error);
    return Response.json(
      { success: false, error: "Failed to fetch job grades" },
      { status: 500 }
    );
  }
}