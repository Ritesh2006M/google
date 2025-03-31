import { Storage } from "@google-cloud/storage";
import fs from "fs";
import path from "path";

// Load service account key file
const keyFilePath = path.resolve("./rough/service.json");

const storage = new Storage({
    keyFilename: keyFilePath, // Use the key file for authentication
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