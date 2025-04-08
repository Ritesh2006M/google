import { NextResponse } from "next/server";
import { Storage } from '@google-cloud/storage';

// Initialize Google Cloud Storage
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

const bucketName = 'uploadhw';

// Extract filename from full URL
function extractFileName(url: string): string {
    // Split by '/' and get the last part
    const parts = url.split('/');
    return parts[parts.length - 1];
}

// Generate signed URL for private file
async function generateSignedUrl(fileName: string): Promise<string> {
    const options = {
        version: 'v4' as const,
        action: 'read' as const,
        expires: Date.now() + 30 * 60 * 1000,
    };

    const [url] = await storage
        .bucket(bucketName)
        .file(fileName)
        .getSignedUrl(options);

    return url;
}

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const pdfPath = searchParams.get("pdfPath");

        if (!pdfPath) {
            return NextResponse.json({ error: "PDF path is required" }, { status: 400 });
        }

        // Extract the actual filename from the URL
        const fileName = extractFileName(pdfPath);
        const signedUrl = await generateSignedUrl(fileName);
        return NextResponse.json({ url: signedUrl });
    } catch (error) {
        console.error("Error generating signed URL:", error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
