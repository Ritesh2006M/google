import {NextRequest, NextResponse} from "next/server";
import db from "@/lib/db"; // Ensure correct import

export async function GET(req: NextRequest) {
    try {
        const {searchParams} = new URL(req.url);
        const rollNo = searchParams.get("rollNo");

        if (!rollNo) {
            return NextResponse.json({success: false, error: "Missing roll number"}, {status: 400});
        }

        const [tasks] = await db.query(
            "SELECT id, subject, question, criteria, total_marks, pdf_location_url, created_at FROM task WHERE rollNo = ?",
            [rollNo]
        );

        return NextResponse.json({success: true, tasks});
    } catch (error) {
        console.error("Database error:", error);
        return NextResponse.json({success: false, error: "Database error"}, {status: 500});
    }
}
