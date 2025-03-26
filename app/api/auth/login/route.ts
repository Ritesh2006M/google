import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function POST(req: Request) {
    try {
        const { email, password } = await req.json();

        // Query the database to check credentials
        const [rows]: any = await db.query(
            "SELECT role FROM user WHERE email = ? AND password = ?",
            [email, password]
        );

        if (rows.length === 0) {
            return NextResponse.json({ success: false, error: "Invalid credentials" });
        }

        return NextResponse.json({ success: true, role: rows[0].role });
    } catch (error) {
        return NextResponse.json({ success: false, error: "Server error" });
    }
}
