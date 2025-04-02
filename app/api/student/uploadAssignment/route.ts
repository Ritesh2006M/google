import {NextResponse} from "next/server";
import db from "@/lib/db"; // MySQL Database connection
import {uploadFile} from "@/lib/googleStorage";
import {processDocumentAI} from "@/app/api/general/ocr"; // Google Cloud Storage function

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        console.log("Received FormData:", formData);

        // Extract fields from the form
        const taskId = formData.get("taskId")?.toString() || "";
        const rollNo = formData.get("rollNo")?.toString() || "";
        const file = formData.get("file") as File | null;

        // Validate required fields
        const missingFields = [];
        if (!taskId) missingFields.push("taskId");
        if (!rollNo) missingFields.push("rollNo");
        if (!file) missingFields.push("file");

        if (missingFields.length > 0) {
            return NextResponse.json({success: false, error: `Missing fields: ${missingFields.join(", ")}`});
        }

        console.log("Uploading file:", file.name);
        const fileBuffer = Buffer.from(await file.arrayBuffer());

        // Upload to Google Cloud Storage & get the file URL
        const pdfUrl = await uploadFile(fileBuffer, file.name);
        let pdftext = "";
        if (file) {
            pdftext = await processDocumentAI(file)
        }

        // Insert data into MySQL `assignment` table without pdf_text
        await db.query(
            "INSERT INTO assignment (task_id, roll_no, pdf_url, pdf_text) VALUES (?, ?, ?, ?)",
            [taskId, rollNo, pdfUrl, pdftext]
        );

        return NextResponse.json({success: true, message: "Assignment uploaded successfully!"});

    } catch (error) {
        console.error("Upload error:", error);
        return NextResponse.json({success: false, error: "Server error"});
    }
}
