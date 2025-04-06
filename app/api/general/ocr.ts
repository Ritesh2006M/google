import { Storage } from "@google-cloud/storage";
import { GoogleAuth } from "google-auth-library";
import { v4 as uuidv4 } from "uuid";
import fs from "fs/promises";

// Google Cloud Project ID
const projectId: string = "747251619768";
const bucketName: string = "uploadhw";
const location: string = "us";
const processorId: string = "7f90007cdf1df941";

// Google Cloud Storage client using ENV credentials
const storage = new Storage({
    credentials: {
        type: process.env.GOOGLE_TYPE,
        project_id: process.env.GCP_PROJECT_ID,
        private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        client_id: process.env.GOOGLE_CLIENT_ID,
        auth_uri: process.env.GOOGLE_AUTH_URI,
        token_uri: process.env.GOOGLE_TOKEN_URI,
        auth_provider_x509_cert_url: process.env.GOOGLE_AUTH_PROVIDER_X509_CERT_URL,
        client_x509_cert_url: process.env.GOOGLE_CLIENT_X509_CERT_URL,
        universe_domain: process.env.GOOGLE_UNIVERSE_DOMAIN,
    },
});

interface FileData {
    name: string;
    arrayBuffer: () => Promise<ArrayBuffer>;
    type: string;
}

export async function processDocumentAI(file: FileData): Promise<string> {
    try {
        if (!file) throw new Error("No file provided.");

        const fileBuffer = Buffer.from(await file.arrayBuffer());
        const uniqueFileName: string = `uploads/${uuidv4()}-${file.name}`;
        const bucket = storage.bucket(bucketName);
        const gcsFile = bucket.file(uniqueFileName);

        await gcsFile.save(fileBuffer, {
            contentType: file.type,
            public: false,
        });

        const gcsUri: string = `gs://${bucketName}/${uniqueFileName}`;
        console.log("✅ File uploaded to GCS:", gcsUri);

        const client = new GoogleAuth({
            credentials: {
                type: process.env.GOOGLE_TYPE,
                project_id: process.env.GCP_PROJECT_ID,
                private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
                private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
                client_email: process.env.GOOGLE_CLIENT_EMAIL,
                client_id: process.env.GOOGLE_CLIENT_ID,
                auth_uri: process.env.GOOGLE_AUTH_URI,
                token_uri: process.env.GOOGLE_TOKEN_URI,
                auth_provider_x509_cert_url: process.env.GOOGLE_AUTH_PROVIDER_X509_CERT_URL,
                client_x509_cert_url: process.env.GOOGLE_CLIENT_X509_CERT_URL,
                universe_domain: process.env.GOOGLE_UNIVERSE_DOMAIN,
            },
            scopes: ["https://www.googleapis.com/auth/cloud-platform"],
        });

        const url: string = `https://${location}-documentai.googleapis.com/v1/projects/${projectId}/locations/${location}/processors/${processorId}:process`;

        const requestBody = {
            name: `projects/${projectId}/locations/${location}/processors/${processorId}`,
            rawDocument: {
                content: fileBuffer.toString("base64"),
                mimeType: "application/pdf",
            },
        };

        const requestOptions: RequestInit = {
            method: "POST",
            headers: {
                Authorization: `Bearer ${await client.getAccessToken()}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(requestBody),
        };

        const result = await fetch(url, requestOptions);
        const resultData = await result.json();

        console.log("📜 Document AI Response:", JSON.stringify(resultData.document?.text, null, 2));

        if (resultData.error) {
            console.error("❌ Document AI Error:", resultData.error);
            throw new Error(resultData.error.message);
        }

        return resultData.document?.text || "No text extracted.";
    } catch (error) {
        console.error("🚨 Error processing document:", error);
        throw new Error("Failed to process document");
    }
}
