import { Storage } from "@google-cloud/storage";
import { GoogleAuth } from "google-auth-library";
import { v4 as uuidv4 } from "uuid";
import fs from "fs/promises";

// Google Cloud Project ID
const projectId: string = "747251619768"; 
// Google Cloud Storage bucket name
const bucketName: string = "uploadhw";
// Google Cloud Storage location
const location: string = "us";
// Document AI Processor ID
const processorId: string = "7f90007cdf1df941"; 
// Path to the service account key file
const keyFilePath: string = "/home/ritesh/Desktop/google/rough/service.json";

// Create a new Google Cloud Storage client
const storage = new Storage({ keyFilename: keyFilePath });

// Interface for file data
interface FileData {
    name: string;
    arrayBuffer: () => Promise<ArrayBuffer>;
    type: string;
}

// Processes a document using Google Document AI
export async function processDocumentAI(file: FileData): Promise<string> {
    try {
        // Check if a file is provided
        if (!file) {
            throw new Error("No file provided.");
        }

        // Convert file to buffer
        const fileBuffer = Buffer.from(await file.arrayBuffer());
        // Generate a unique file name for GCS
        const uniqueFileName: string = `uploads/${uuidv4()}-${file.name}`;
        // Get the GCS bucket
        const bucket = storage.bucket(bucketName);
        // Get a reference to the GCS file
        const gcsFile = bucket.file(uniqueFileName);

        // Upload the file to GCS
        await gcsFile.save(fileBuffer, {
            contentType: file.type,
            public: false,
        });

        // Construct the GCS URI
        const gcsUri: string = `gs://${bucketName}/${uniqueFileName}`;
        // Log the GCS URI
        console.log("✅ File uploaded to GCS:", gcsUri);

        // Create a new Google Auth client
        const client = new GoogleAuth({
            keyFile: keyFilePath,
            scopes: ["https://www.googleapis.com/auth/cloud-platform"],
        });

        // Construct the Document AI API URL
        const url: string = `https://us-documentai.googleapis.com/v1/projects/${projectId}/locations/${location}/processors/${processorId}:process`;

        // Create the request body for Document AI
        const requestBody = {
            name: `projects/${projectId}/locations/${location}/processors/${processorId}`,
            rawDocument: { 
                content: fileBuffer.toString("base64"), 
                mimeType: "application/pdf",
            },
        };

        // Create the request options
        const requestOptions: RequestInit = {
            method: "POST",
            headers: {
                Authorization: `Bearer ${await client.getAccessToken()}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(requestBody),
        };

        // Make the request to the Document AI API
        const result = await fetch(url, requestOptions);
        // Parse the JSON response
        const resultData = await result.json();

        // Log the Document AI response
        console.log("📜 Document AI Response:", JSON.stringify(resultData.document.text , null, 2));

        // Check for errors in the Document AI response
        if (resultData.error) {
            console.error("❌ Document AI Error:", resultData.error);
            throw new Error(resultData.error.message);
        }

        // Return the extracted text or a default message
        return resultData.document?.text || "No text extracted.";
    } catch (error) {
        // Log and re-throw any errors
        console.error("🚨 Error processing document:", error);
        throw new Error("Failed to process document");
    }
}
