// app/api/student/result/route.ts
import { NextRequest, NextResponse } from 'next/server';
import db from "@/lib/db"; // Ensure this is correctly configured

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const rollNo = searchParams.get("rollNo");

    if (!rollNo) {
        return NextResponse.json({ error: "Missing rollNo" }, { status: 400 });
    }

    try {
        const [rows]: any = await db.execute(`
            SELECT r.assignment_id,
                   r.task_id,
                   r.result,
                   r.response,
                   t.subject,
                   t.question
            FROM result r
                     JOIN task t ON r.task_id = t.id
            WHERE r.roll_no = ?
        `, [rollNo]);

        return NextResponse.json({ success: true, results: rows });
    } catch (error) {
        console.error("Error fetching results:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
