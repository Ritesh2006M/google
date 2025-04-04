import {NextResponse} from "next/server";
import db from "@/lib/db";
import {uploadFile} from "@/lib/googleStorage";
import {processDocumentAI} from "@/app/api/general/ocr";

// Function to send assignmentId to an external API
async function sendAssignmentId(assignmentId: number) {
    try {
        console.log(`Sending assignmentId: ${assignmentId} to external API...`);

        const projectId = process.env.GCP_PROJECT_ID;
        const response = await fetch(`https://us-central1-${projectId}.cloudfunctions.net/evaluateAnswer`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({assignmentId}),
        });


        // Ensure response is valid before parsing JSON
        if (!response.ok) {
            throw new Error(`External API Error: ${response.status} ${response.statusText}`);
        }

        const result = await response.json().catch(() => {
            throw new Error("Invalid JSON response from external API");
        });

        console.log("✅ Response from external API:", result);
    } catch (error) {
        console.error("❌ Error sending assignmentId:", error);
    }
}

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        console.log("📥 Received FormData:", formData);

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
            console.warn("⚠️ Missing fields:", missingFields.join(", "));
            return NextResponse.json({
                success: false,
                error: `Missing fields: ${missingFields.join(", ")}`
            }, {status: 400});
        }

        console.log(`📤 Uploading file: ${file.name} (Size: ${file.size} bytes)`);
        const fileBuffer = Buffer.from(await file.arrayBuffer());

        // Upload file to Google Cloud Storage & get the file URL
        const pdfUrl = await uploadFile(fileBuffer, file.name);
        let pdfText = "";
        if (file) {
            pdfText = await processDocumentAI(file);
        }

        console.log("📄 Extracted PDF text:", pdfText.substring(0, 100)); // Log first 100 characters

        // Insert data into MySQL `assignment` table
        let assignmentId;
        try {
            const [insertResult]: any = await db.query(
                "INSERT INTO assignment (task_id, roll_no, pdf_url, pdf_text) VALUES (?, ?, ?, ?)",
                [taskId, rollNo, pdfUrl, pdfText]
            );
            assignmentId = insertResult.insertId;
            console.log(`✅ Assignment inserted with ID: ${assignmentId}`);
        } catch (dbError) {
            console.error("❌ Database Insertion Error:", dbError);
            return NextResponse.json({success: false, error: "Database error"}, {status: 500});
        }

        if (!assignmentId) {
            console.error("❌ Failed to retrieve assignmentId");
            return NextResponse.json({success: false, error: "Assignment ID not found"}, {status: 500});
        }

        // Send assignmentId to external API (Google Cloud Function)
        await sendAssignmentId(assignmentId);

        return NextResponse.json({success: true, message: "Assignment uploaded successfully!"});

    } catch (error) {
        console.error("❌ Server Error:", error);
        return NextResponse.json({success: false, error: "Server error"}, {status: 500});
    }
}
