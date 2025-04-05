import { NextResponse } from "next/server";
import db from "@/lib/db"; // This should be a MySQL connection instance (like mysql2)

export async function GET() {
    try {
        const [rows]: any = await db.query("SELECT subject_name FROM subject");
        const subjectNames = rows.map((row: any) => row.subject_name);

        return NextResponse.json({ subjects: subjectNames });
    } catch (err) {
        console.error("Error fetching subjects:", err);
        return NextResponse.json({ error: "Failed to fetch subjects" }, { status: 500 });
    }
}
