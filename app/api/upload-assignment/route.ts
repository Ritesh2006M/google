import {NextApiRequest, NextApiResponse} from "next";
import {PrismaClient} from "@prisma/client";
import {uploadFile} from "@/lib/googleStorage";
import formidable from "formidable";
import fs from "fs";

const prisma = new PrismaClient();

// Disable Next.js body parser to handle `multipart/form-data` manually
export const config = {
    api: {bodyParser: false},
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    console.log("📩 Received request:", req.method);

    if (req.method !== "POST") {
        return res.status(405).json({error: "Method not allowed"});
    }

    try {
        const form = formidable({multiples: false, uploadDir: "/tmp", keepExtensions: true});

        form.parse(req, async (err, fields, files) => {
            if (err) {
                console.error("❌ Form Parsing Error:", err);
                return res.status(500).json({error: "Error parsing form data"});
            }

            console.log("📋 Parsed Fields:", fields);

            // Extract required fields
            const {subject, question, criteria, totalMarks, autoEval} = fields;

            if (!question) {
                return res.status(400).json({error: "Missing assignment question!"});
            }

            const isAutoEvaluation = autoEval === "true";
            let criteriaText = "Unavailable"; // Default value

            if (isAutoEvaluation) {
                criteriaText = "Evaluate based on yourself";
            } else {
                if (!criteria || criteria.length === 0) {
                    return res.status(400).json({error: "Please provide evaluation criteria!"});
                }
                criteriaText = criteria as string;
            }

            let fileUrl = "Unavailable"; // Default if no file uploaded

            if (files.file) {
                const file = files.file[0];

                if (file.size > 0) {
                    console.log("📂 File received:", file.originalFilename, "Size:", file.size);

                    try {
                        const fileBuffer = fs.readFileSync(file.filepath);
                        console.log("⏫ Uploading file...");
                        fileUrl = await uploadFile(fileBuffer, file.originalFilename || "uploaded.pdf");
                        console.log("✅ File uploaded successfully:", fileUrl);

                        fs.unlinkSync(file.filepath); // Delete temp file
                    } catch (uploadError) {
                        console.error("❌ File Upload Error:", uploadError);
                    }
                } else {
                    console.warn("⚠️ No valid file received!");
                }
            }

            // Validate and store in the database
            try {
                console.log("🛢 Storing in database...");
                const task = await prisma.task.create({
                    data: {
                        subject: subject as string,
                        question: question as string,
                        criteria: criteriaText,
                        total_marks: parseInt(totalMarks as string, 10) || 0,
                        auto_eval: isAutoEvaluation,
                        pdf_location_url: fileUrl,
                    },
                });

                console.log("✅ Task stored:", task);
                return res.status(200).json({success: true, task});
            } catch (dbError) {
                console.error("❌ Database Error:", dbError);

                return res.status(500).json({
                    error: "Database error",
                    details: dbError instanceof Error ? dbError.message : "Unknown error",
                });
            }

        });
    } catch (error) {
        console.error("❌ Server Error:", error);
        return res.status(500).json({error: "Internal server error"});
    }
};
