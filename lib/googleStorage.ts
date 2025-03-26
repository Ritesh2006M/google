import {Storage} from "@google-cloud/storage";

const storage = new Storage({
    credentials: {
        client_email: process.env.GOOGLE_CLOUD_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_CLOUD_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    },
    projectId: process.env.GOOGLE_CLOUD_PROJECT,
});

const bucketName = process.env.GCS_BUCKET_NAME!;
const bucket = storage.bucket(bucketName);

export async function uploadFile(file: File) {
    const fileName = `${Date.now()}-${file.name}`;
    const fileRef = bucket.file(fileName);

    await fileRef.save(Buffer.from(await file.arrayBuffer()), {
        metadata: {contentType: file.type},
    });

    return `https://storage.googleapis.com/${bucketName}/${fileName}`;
}
