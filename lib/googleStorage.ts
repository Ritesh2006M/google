import { Storage } from "@google-cloud/storage";

// Create Google Cloud Storage client using credentials from env vars
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

const bucketName = "uploadhw"; // Replace with your actual bucket name
const bucket = storage.bucket(bucketName);

export async function uploadFile(fileBuffer: Buffer, fileName: string) {
    const uniqueFileName = `${Date.now()}-${fileName}`;
    const fileRef = bucket.file(uniqueFileName);

    await fileRef.save(fileBuffer, {
        metadata: { contentType: "application/pdf" },
    });

    return `https://storage.googleapis.com/${bucketName}/${uniqueFileName}`;
}
