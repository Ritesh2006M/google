import {NextRequest, NextResponse} from "next/server";
import db from "@/lib/db"; // Ensure correct import

// ✅ GET: Fetch tasks including status
export async function GET(req: NextRequest) {
    try {
        const {searchParams} = new URL(req.url);
        const rollNo = searchParams.get("rollNo");

        if (!rollNo) {
            return NextResponse.json({success: false, error: "Missing roll number"}, {status: 400});
        }

        const [tasks] = await db.query(
            "SELECT id, subject, question, criteria, total_marks, pdf_location_url, created_at, status FROM task WHERE rollNo = ?",
            [rollNo]
        );

        return NextResponse.json({success: true, tasks});
    } catch (error) {
        console.error("Database error:", error);
        return NextResponse.json({success: false, error: "Database error"}, {status: 500});
    }
}

// ✅ DELETE: Remove a task
export async function DELETE(req: NextRequest) {
    try {
        const {searchParams} = new URL(req.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json({success: false, error: "Missing task ID"}, {status: 400});
        }

        const [result] = await db.query("DELETE FROM task WHERE id = ?", [id]);

        // @ts-ignore
        if (result.affectedRows === 0) {
            return NextResponse.json({success: false, error: "Task not found"}, {status: 404});
        }

        return NextResponse.json({success: true, message: "Task deleted successfully"});
    } catch (error) {
        console.error("Database error:", error);
        return NextResponse.json({success: false, error: "Database error"}, {status: 500});
    }
}

// ✅ PUT: Update task status
export async function PUT(req: NextRequest) {
    try {
        const {id, status} = await req.json();

        if (!id || status === undefined) {
            return NextResponse.json({success: false, error: "Missing task ID or status"}, {status: 400});
        }

        const newStatus = status ? 1 : 0; // Convert boolean to MySQL format

        const [result] = await db.query("UPDATE task SET status = ? WHERE id = ?", [newStatus, id]);

        // @ts-ignore
        if (result.affectedRows === 0) {
            return NextResponse.json({success: false, error: "Task not found"}, {status: 404});
        }

        return NextResponse.json({success: true, message: "Task status updated", updatedStatus: newStatus});
    } catch (error) {
        console.error("Database error:", error);
        return NextResponse.json({success: false, error: "Database error"}, {status: 500});
    }
}
