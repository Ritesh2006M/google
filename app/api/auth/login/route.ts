import {NextResponse} from "next/server";
import db from "@/lib/db";

export async function POST(req: Request) {
    try {
        const {email, password} = await req.json();
        if (!email || !password) {
            return NextResponse.json({success: false, error: "Email and password are required"});
        }

        // Query the database to check credentials
        const [rows]: any = await db.query(
            "SELECT email, role FROM user WHERE email = ? AND password = ?",
            [email, password]
        );

        if (rows.length === 0) {
            return NextResponse.json({success: false, error: "Invalid credentials"});
        }

        const user = rows[0];

        // Fetch teacher details if the role is "teacher"
        let teacherData = null;
        if (user.role === "teacher") {
            const [teacherRows]: any = await db.query(
                "SELECT id, email, rollNo, fullName, subject FROM teacherView WHERE email = ?",
                [email]
            );

            if (teacherRows.length > 0) {
                teacherData = teacherRows[0];
            }
        }

        // Fetch student details if the role is "student"
        let studentData = null;
        let studentSubjects = [];
        if (user.role === "student") {
            const [studentRows]: any = await db.query(
                "SELECT * FROM studentView WHERE student_email = ?",
                [email]
            );

            if (studentRows.length > 0) {
                studentData = studentRows[0];
            }
            // Fetch student subjects in one query
            const [subjectRows]: any = await db.query(
                `SELECT s.subject_id, s.subject_name 
                 FROM student_subject ss 
                 JOIN subject s ON ss.subject_id = s.subject_id 
                 WHERE ss.student_email = ?`,
                [email]
            );

            studentSubjects = subjectRows;
        }

        return NextResponse.json({
            success: true,
            email: user.email,
            role: user.role,
            teacherData,
            studentData,
            studentSubjects,
        });

    } catch (error) {
        console.error("Server error:", error);
        return NextResponse.json({success: false, error: "Server error"});
    }
}
