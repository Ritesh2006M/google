// app/api/auth/verify/route.ts
import {NextResponse} from "next/server";
import db from "@/lib/db";

export async function POST(req: Request) {
    try {
        const {regisNo} = await req.json();

        if (!regisNo) {
            return NextResponse.json({success: false, message: "Registration number required"}, {status: 400});
        }

        const [result] = await db.execute(
            "SELECT role FROM people WHERE rollNo = ?",
            [regisNo]
        );

        if (Array.isArray(result) && result.length > 0) {
            // @ts-ignore
            const {role} = result[0];
            return NextResponse.json({success: true, role});
        } else {
            return NextResponse.json({success: false, message: "Invalid registration number"}, {status: 404});
        }
    } catch (error) {
        console.error("Error verifying user:", error);
        return NextResponse.json({success: false, message: "Server error"}, {status: 500});
    }
}
