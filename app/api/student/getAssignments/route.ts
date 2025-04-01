import {NextResponse} from "next/server";
import db from "@/lib/db";

export async function GET(req: Request) {
    try {
        const {searchParams} = new URL(req.url);
        const email = searchParams.get("email");

        if (!email) {
            return NextResponse.json({error: "Email is required"}, {status: 400});
        }

        // Get student's subjects
        const [subjectRows]: any = await db.query(
            `SELECT subject_id
             FROM student_subject
             WHERE student_email = ?`,
            [email]
        );

        if (!subjectRows.length) {
            return NextResponse.json({assignments: []});
        }

        const subjectIds = subjectRows.map((row: any) => row.subject_id);
        if (subjectIds.length === 0) {
            return NextResponse.json({assignments: []});
        }

        // Fetch assignments along with submission status
        const [assignments]: any = await db.query(
            `SELECT t.id,
                    s.subject_name,
                    t.question,
                    t.total_marks,
                    t.pdf_location_url,
                    CASE
                        WHEN a.assignment_id IS NOT NULL THEN 1
                        ELSE 0
                        END AS is_submitted
             FROM task t
                      JOIN subject s ON t.subject_id = s.subject_id
                      LEFT JOIN assignment a ON t.id = a.task_id AND a.roll_no = (SELECT rollNo
                                                                                  FROM userDetails
                                                                                  WHERE email = ?)
             WHERE t.status = 1
               AND t.subject_id IN (${subjectIds.map(() => "?").join(",")})`,
            [email, ...subjectIds]
        );

        return NextResponse.json({assignments});
    } catch (error) {
        console.error("Error fetching assignments:", error);
        return NextResponse.json({error: "Server error"}, {status: 500});
    }
}
