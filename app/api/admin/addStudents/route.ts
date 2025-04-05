import {NextResponse} from "next/server";
import db from "@/lib/db";

export async function POST(req: Request) {
    try {
        const {students} = await req.json();

        if (!Array.isArray(students)) {
            return NextResponse.json({success: false, message: "Invalid input"}, {status: 400});
        }

        for (const student of students) {
            if (!student.rollNo) continue;

            await db.execute(
                "INSERT INTO people (rollNo, role) VALUES (?, 'student') ON DUPLICATE KEY UPDATE role = 'student'",
                [student.rollNo]
            );
        }

        return NextResponse.json({success: true, message: "Students added"});
    } catch (error) {
        console.error("Error adding students:", error);
        return NextResponse.json({success: false, message: "Server error"}, {status: 500});
    }
}
