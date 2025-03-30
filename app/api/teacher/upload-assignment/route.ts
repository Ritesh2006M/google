import {NextResponse} from "next/server";
import db from "@/lib/db";
import {uploadFile} from "@/lib/googleStorage";

export async function POST(req: Request) {
    try {
        const formData = await req.formData(); // Parse FormData
        console.log("Received FormData:", formData);

        // Extract fields (Fixed 'question' field)
        const question = formData.get("assignmentQuestion")?.toString() || ""; // Fix here
        const subject = formData.get("subject")?.toString() || "";
        const rollNo = formData.get("rollNo")?.toString() || "";
        const criteria = formData.get("criteria")?.toString() || "";
        const totalMarks = formData.get("totalMarks")?.toString() || "";
        const file = formData.get("file") as File | null;

        // Debugging: Check missing fields
        console.log({question, subject, criteria, totalMarks, file});

        // Identify which field is missing
        const missingFields = [];
        if (!question) missingFields.push("assignmentQuestion"); // Updated
        if (!subject) missingFields.push("subject");
        if (!criteria) missingFields.push("criteria");
        if (!totalMarks) missingFields.push("totalMarks");

        // Return error message if fields are missing
        if (missingFields.length > 0) {
            return NextResponse.json({
                success: false,
                error: `Missing required fields: ${missingFields.join(", ")}`
            });
        }

        let pdfUrl = "";

        // Handle file assignments if a file is provided
        if (file) {
            console.log("Uploading file:", file.name);
            const fileBuffer = Buffer.from(await file.arrayBuffer());
            pdfUrl = await uploadFile(fileBuffer, file.name);
        }

        // Insert data into MySQL `task` table
        await db.query(
            "INSERT INTO task (subject, question, criteria, total_marks, pdf_location_url, rollNo) VALUES (?, ?, ?, ?, ?, ?)",
            [subject, question, criteria, totalMarks, pdfUrl, rollNo]
        );

        return NextResponse.json({success: true, message: "Assignment uploaded successfully!"});

    } catch (error) {
        console.error("Upload error:", error);
        return NextResponse.json({success: false, error: "Server error"});
    }
}
