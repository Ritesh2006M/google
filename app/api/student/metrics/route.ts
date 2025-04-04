// /app/api/student/performance/route.ts
import {NextRequest, NextResponse} from "next/server";
import db from "@/lib/db";

export async function GET(req: NextRequest) {
    const rollNo = req.nextUrl.searchParams.get("rollNo");

    if (!rollNo) {
        return NextResponse.json({success: false, error: "Missing roll number"}, {status: 400});
    }

    try {
        const [results]: any = await db.query(
            "SELECT marks, total_marks FROM studentPerformance WHERE rollNo = ?",
            [rollNo]
        );

        let totalScored = 0;
        let totalPossible = 0;

        for (const entry of results) {
            totalScored += entry.marks;
            totalPossible += entry.total_marks;
        }

        const averagePercentage = totalPossible > 0 ? (totalScored / totalPossible) * 100 : 0;

        return NextResponse.json({
            success: true,
            totalScored,
            totalPossible,
            averagePercentage: averagePercentage.toFixed(2),
        });
    } catch (error) {
        console.error("❌ Error fetching student performance:", error);
        return NextResponse.json({success: false, error: "Internal server error"}, {status: 500});
    }
}
