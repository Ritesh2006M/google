// /app/api/student/getAssignments/route.ts

import {NextRequest, NextResponse} from "next/server";
import db from "@/lib/db";

export async function GET(req: NextRequest) {
    const email = req.nextUrl.searchParams.get("email");

    if (!email) {
        return NextResponse.json({success: false, error: "Missing email"}, {status: 400});
    }

    try {
        // Get all task_ids the student has submitted
        const [submitted]: any = await db.query(
            "SELECT task_id FROM assignmentStatus WHERE email = ?",
            [email]
        );

        const submittedTaskIds = submitted.map((entry: any) => entry.task_id);

        // Get all eligible tasks for this student based on their enrolled subjects
        const [subjects]: any = await db.query(
            "SELECT subject_id FROM student_subject WHERE student_email = ?",
            [email]
        );

        const subjectIds = subjects.map((s: any) => s.subject_id);
        if (subjectIds.length === 0) {
            return NextResponse.json({
                success: true,
                totalAssignments: 0,
                completedAssignments: 0,
                pendingAssignments: 0
            });
        }

        const [tasks]: any = await db.query(
            `SELECT id
             FROM task
             WHERE subject_id IN (?)`,
            [subjectIds]
        );

        const totalAssignments = tasks.length;
        const completedAssignments = tasks.filter((task: any) =>
            submittedTaskIds.includes(task.id)
        ).length;

        const pendingAssignments = totalAssignments - completedAssignments;

        return NextResponse.json({
            success: true,
            totalAssignments,
            completedAssignments,
            pendingAssignments,
        });
    } catch (error) {
        console.error("❌ Error fetching assignments:", error);
        return NextResponse.json({success: false, error: "Internal server error"}, {status: 500});
    }
}
