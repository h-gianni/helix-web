import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Using the exact model name from schema.prisma
    const jobGrades = await prisma.$queryRaw`
      SELECT * FROM "JobGrade" ORDER BY level ASC
    `;

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