import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET() {
    try {
        const [rows] = await db.query("SELECT 1 + 1 AS result");
        return NextResponse.json({ success: true, data: rows });
    } catch (error) {
        // @ts-ignore
        return NextResponse.json({ success: false, error: error.message });
    }
}
